import { PrismaClient } from "@/lib/generated/prisma";

declare global {
  var prismaGlobal: PrismaClient | undefined
}

const prisma = global.prismaGlobal || new PrismaClient()

if (process.env.NODE_ENV !== "production") {
  global.prismaGlobal = prisma
}

export default prisma
