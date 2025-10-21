import { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function getUserbyEmail({ email }: { email: string }) {
  const user = await prisma.user.findUnique({ where: { email } });

  return user;
}

export async function createUser({ data }: { data: Prisma.UserCreateInput }) {
  const user = await prisma.user.create({ data });

  return user;
}
