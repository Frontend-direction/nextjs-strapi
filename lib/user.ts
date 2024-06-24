import type { User } from "@prisma/client";
import { compare, hash } from "bcrypt";
import { db } from "./db";

export type CreateUserData = Omit<User, "id" | "passwordHash"> & {
  password: string;
};

export async function authenticateUser(email: string, password: string) {
  const user = await db.user.findUnique({
    where: { email },
  });
  if (user && (await compare(password, user.passwordHash))) {
    return user;
  }
}

export async function createUser({ email, name, password }: CreateUserData) {
  const passwordHash = await hash(password, 10);
  return await db.user.create({
    data: { email, name, passwordHash },
  });
}
