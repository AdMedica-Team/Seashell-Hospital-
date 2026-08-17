"use server";

import * as z from "zod";
import { prisma } from "@/lib/db";
import { isPaymentConfigured, createCheckoutSession } from "@/lib/payments";

const LookupSchema = z.object({
  reference: z.string().min(3).max(64),
});

export type PayState =
  | {
      status: "found" | "notFound" | "error" | "pending" | "redirect";
      error?: string;
      reference?: string;
      bill?: {
        referenceNumber: string;
        amount: string;
        currency: string;
        status: string;
        payerName: string | null;
      };
      redirectUrl?: string;
      providerReady?: boolean;
    }
  | undefined;

/** Public bill lookup by reference — no login required. */
export async function lookupPaymentAction(
  _prev: PayState,
  formData: FormData,
): Promise<PayState> {
  const parsed = LookupSchema.safeParse({ reference: formData.get("reference") });
  if (!parsed.success) {
    return { status: "error", error: "invalid" };
  }
  const reference = parsed.data.reference.trim();

  const txn = await prisma.paymentTransaction.findFirst({
    where: { referenceNumber: reference },
    orderBy: { createdAt: "desc" },
  });

  if (!txn) {
    return { status: "notFound", reference };
  }

  return {
    status: "found",
    reference,
    bill: {
      referenceNumber: txn.referenceNumber,
      amount: txn.amount.toString(),
      currency: txn.currency,
      status: txn.status,
      payerName: txn.payerName,
    },
    providerReady: isPaymentConfigured(),
  };
}

/**
 * Start payment. Until a gateway is connected this returns a "pending" state so
 * the UI can tell the patient to pay in person; once configured it hands off to
 * the gateway's hosted checkout.
 */
export async function startPaymentAction(
  _prev: PayState,
  formData: FormData,
): Promise<PayState> {
  const reference = formData.get("reference")?.toString().trim();
  if (!reference) return { status: "error", error: "invalid" };

  const txn = await prisma.paymentTransaction.findFirst({
    where: { referenceNumber: reference },
    orderBy: { createdAt: "desc" },
  });
  if (!txn) return { status: "notFound", reference };

  const session = await createCheckoutSession({
    referenceNumber: txn.referenceNumber,
    amount: Number(txn.amount),
    currency: txn.currency,
  });

  if (!session) {
    return { status: "pending", reference };
  }
  return { status: "redirect", reference, redirectUrl: session.redirectUrl };
}
