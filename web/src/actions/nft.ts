import { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function storeNFT({ data }: { data: Prisma.NFTCreateInput }) {
  const res = prisma.nFT.create({ data });

  return res;
}

export async function updateNFT({
  where,
  data,
}: {
  where: Prisma.NFTWhereUniqueInput;
  data: Prisma.NFTUpdateInput;
}) {
  const res = prisma.nFT.update({ where, data });

  return res;
}

export async function getNFTById({ id }: { id: string }) {
  const res = prisma.nFT.findUnique({ where: { id } });

  return res;
}

export async function removeNFT({ id }: { id: string }) {
  const res = prisma.nFT.delete({ where: { id } });

  return res;
}

export async function getNFTByUserId({ userId }: { userId: string }) {
  const res = prisma.nFT.findMany({ where: { artist: { id: userId } } });

  return res;
}

export async function updateNFTById({ id }: { id: string }) {
  const res = prisma.nFT.findUnique({ where: { id } });

  return res;
}
