"use server";

import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import * as z from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { logAudit } from "@/lib/audit";
import { sendSms, isSmsConfigured } from "@/lib/sms";

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 5;

const RequestSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6).max(20),
});

const VerifySchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(6).max(20),
  code: z.string().regex(/^\d{6}$/),
});

export type CallbackState =
  | {
      step: "request" | "verify" | "done";
      name?: string;
      phone?: string;
      devCode?: string;
      error?: string;
    }
  | undefined;

/**
 * Single entry point driven by the hidden `intent` field so the form can use one
 * useActionState hook across both steps.
 */
export async function submitCallbackAction(
  _prev: CallbackState,
  formData: FormData,
): Promise<CallbackState> {
  const intent = formData.get("intent")?.toString();
  return intent === "verify" ? verifyOtp(formData) : requestOtp(formData);
}

async function requestOtp(formData: FormData): Promise<CallbackState> {
  const parsed = RequestSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) {
    return { step: "request", error: "invalid" };
  }
  const { name, phone } = parsed.data;

  const code = String(randomInt(100000, 1000000));
  const codeHash = await bcrypt.hash(code, 10);
  await prisma.otpChallenge.create({
    data: { phone, codeHash, expiresAt: new Date(Date.now() + OTP_TTL_MS) },
  });

  await sendSms(phone, `Seashell Hospital verification code: ${code}`);

  return {
    step: "verify",
    name,
    phone,
    // Pre-launch only: surface the code in the UI when no SMS provider is wired.
    ...(isSmsConfigured() ? {} : { devCode: code }),
  };
}

async function verifyOtp(formData: FormData): Promise<CallbackState> {
  const parsed = VerifySchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    code: formData.get("code"),
  });
  if (!parsed.success) {
    const name = formData.get("name")?.toString();
    const phone = formData.get("phone")?.toString();
    return { step: "verify", name, phone, error: "invalidCode" };
  }
  const { name, phone, code } = parsed.data;

  const challenge = await prisma.otpChallenge.findFirst({
    where: { phone, consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  if (!challenge) {
    return { step: "verify", name, phone, error: "expired" };
  }
  if (challenge.attempts >= MAX_ATTEMPTS) {
    return { step: "verify", name, phone, error: "tooMany" };
  }

  const ok = await bcrypt.compare(code, challenge.codeHash);
  if (!ok) {
    await prisma.otpChallenge.update({
      where: { id: challenge.id },
      data: { attempts: { increment: 1 } },
    });
    return { step: "verify", name, phone, error: "wrongCode" };
  }

  // Success: consume the challenge and record a verified callback request.
  await prisma.otpChallenge.update({
    where: { id: challenge.id },
    data: { consumedAt: new Date() },
  });
  await prisma.callbackRequest.create({
    data: { name, phone, phoneVerified: true, otpVerifiedAt: new Date() },
  });

  revalidatePath("/[locale]/admin/callback-requests", "page");
  return { step: "done", name, phone };
}

export async function updateCallbackStatusAction(id: string, status: string) {
  const session = await requireRole(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);
  await prisma.callbackRequest.update({ where: { id }, data: { status } });
  await logAudit({
    userId: session.user.id,
    action: "CALLBACK_STATUS_UPDATE",
    entityType: "CallbackRequest",
    entityId: id,
    diff: { status },
  });
  revalidatePath("/[locale]/admin/callback-requests", "page");
}
