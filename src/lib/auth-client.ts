import type { Session } from "@/lib/auth";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;

export type { Session };
