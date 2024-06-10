import type { Comment } from "@prisma/client";
import { db } from "./db";

export type CreateCommentData = Omit<Comment, "id" | "postedAt">;

export async function createComment({
  slug,
  user,
  message,
}: CreateCommentData) {
  return await db.comment.create({
    data: { slug, user, message },
  });
}

export async function getComments(slug: string) {
  await new Promise((resolve) => setTimeout(resolve, 3000)); // test loading
  return await db.comment.findMany({
    where: { slug },
  });
}
