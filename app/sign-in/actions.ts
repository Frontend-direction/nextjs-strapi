"use server";

import type { ActionError } from "@/lib/actions";
import { setSessionCookie } from "@/lib/auth";
import { authenticateUser } from "@/lib/user";
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
  const user = await authenticateUser(email, password);
  if (!user) {
    return { isError: true, message: "Invalid credentials" };
  }
  await setSessionCookie(user);
  redirect("/");
}
