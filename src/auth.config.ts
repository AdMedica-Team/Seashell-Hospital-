import type { NextAuthConfig } from "next-auth";
import type { Role } from "@/generated/prisma/client";

/**
 * Edge/proxy-safe config: no Prisma or bcrypt imports here. proxy.ts uses
 * this (via auth.edge.ts) to decode the session cookie only; the full
 * config with the Credentials provider (which does hit the database) lives
 * in auth.ts and is only ever imported from Server Components/Actions/route
 * handlers, never from proxy.ts.
 */
export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role as Role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as Role;
      return session;
    },
  },
} satisfies NextAuthConfig;
