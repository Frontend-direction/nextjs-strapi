"use server";

import type { ActionError } from "@/lib/actions";
import type { CreateCommentData } from "@/lib/comments";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getUserFromSession } from "@/lib/auth";
import { createComment } from "@/lib/comments";

export async function createCommentAction(
  formData: FormData
): Promise<undefined | ActionError> {
  const user = await getUserFromSession();
  if (!user) {
    throw new Error("Unauthorized");
  }
  const data: CreateCommentData = {
    slug: formData.get("slug") as string,
    userId: user.id,
    message: formData.get("message") as string,
  };
  console.log("data", formData);
  const error = validate(data);
  if (error) {
    return { isError: true, message: error };
  }
  const comment = await createComment(data);
  console.log("created:", comment);
  revalidatePath(`/reviews/${data.slug}`);
  redirect(`/reviews/${data.slug}`);
}

function validate(data: CreateCommentData): string | undefined {
  if (!data.message) {
    return "Comment field is required";
  }
  if (data.message.length > 500) {
    return "Comment field cannot be longer than 500 characters";
  }
}
