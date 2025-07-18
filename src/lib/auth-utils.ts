import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const headersList = await headers();
  const session = await auth.api.getSession({
    headers: headersList,
  });

  if (!session) {
    redirect("/signin");
  }

  return session;
}

export async function getOptionalAuth() {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    return session || null;
  } catch {
    return null;
  }
}

export function withAuth<T extends (...args: never[]) => unknown>(fn: T): T {
  return (async (...args: Parameters<T>) => {
    await requireAuth();
    return fn(...args);
  }) as T;
}
