let prisma;

const getPrisma = async () => {
  if (!prisma) {
    const { PrismaClient } = await import("@prisma/client");
    prisma = new PrismaClient();
  }
  return prisma;
};

export default getPrisma;
