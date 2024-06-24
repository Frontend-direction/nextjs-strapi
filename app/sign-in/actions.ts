"use server";

import type { ActionError } from "@/lib/actions";
import { setSessionCookie } from "@/lib/auth";
import { redirect } from "next/navigation";

export interface AuthenticatedUser {
  email: string;
  [propName: string]: unknown;
}

export async function signInAction(
  formData: FormData
): Promise<undefined | ActionError> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const user = authenticate(email, password);
  if (!user) {
    return { isError: true, message: "Invalid credentials" };
  }
  await setSessionCookie(user);
  redirect("/");
}

function authenticate(
  email: string,
  password: string
): AuthenticatedUser | undefined {
  if (email.endsWith("@example.com") && password === "test") {
    return { email };
  }
}
