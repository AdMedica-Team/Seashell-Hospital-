import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Used only by proxy.ts — decodes the session cookie, no Prisma/bcrypt.
export const { auth } = NextAuth(authConfig);
