"use server";

import type { ActionError } from "@/lib/actions";
import { redirect } from "next/navigation";
import { setSessionCookie } from "@/lib/auth";
import { createUser } from "@/lib/user";

export async function signUpAction(
  formData: FormData
): Promise<undefined | ActionError> {
  console.log("[signUpAction]", formData);
  const data = {
    email: formData.get("email") as string,
    name: formData.get("name") as string,
    password: formData.get("password") as string,
  };
  // TODO validate data
  const user = await createUser(data);
  console.log("[signUpAction] user:", user);
  await setSessionCookie(user);
  redirect("/");
}
