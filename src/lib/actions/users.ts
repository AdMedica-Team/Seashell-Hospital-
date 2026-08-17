"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { prisma } from "@/lib/db";
import { requireRole } from "@/lib/dal";
import { logAudit } from "@/lib/audit";

const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  role: z.enum(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]),
});

export type UserFormState = { error?: string } | undefined;

export async function createUserAction(
  _prevState: UserFormState,
  formData: FormData,
): Promise<UserFormState> {
  const session = await requireRole(["SUPER_ADMIN"]);

  const parsed = CreateUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: "Please check the form fields." };
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });
  if (existing) {
    return { error: "A user with this email already exists." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  const created = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      role: parsed.data.role,
    },
  });

  await logAudit({
    userId: session.user.id,
    action: "USER_CREATE",
    entityType: "User",
    entityId: created.id,
    diff: { name: created.name, email: created.email, role: created.role },
  });

  revalidatePath("/[locale]/admin/users", "page");
  return undefined;
}

export async function toggleUserActiveAction(userId: string) {
  const session = await requireRole(["SUPER_ADMIN"]);

  const target = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { isActive: !target.isActive },
  });

  await logAudit({
    userId: session.user.id,
    action: "USER_TOGGLE_ACTIVE",
    entityType: "User",
    entityId: userId,
    diff: { before: { isActive: target.isActive }, after: { isActive: updated.isActive } },
  });

  revalidatePath("/[locale]/admin/users", "page");
}

const RoleSchema = z.enum(["CONTENT_EDITOR", "MARKETING_ADMIN", "SUPER_ADMIN"]);

export async function updateUserRoleAction(userId: string, formData: FormData) {
  const session = await requireRole(["SUPER_ADMIN"]);

  const parsedRole = RoleSchema.safeParse(formData.get("role"));
  if (!parsedRole.success) return;

  const target = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role: parsedRole.data },
  });

  await logAudit({
    userId: session.user.id,
    action: "USER_ROLE_CHANGE",
    entityType: "User",
    entityId: userId,
    diff: { before: { role: target.role }, after: { role: updated.role } },
  });

  revalidatePath("/[locale]/admin/users", "page");
}
