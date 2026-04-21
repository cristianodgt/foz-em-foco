import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function createPrismaClient() {
  const isProduction = process.env.NODE_ENV === "production";
  const pool = new Pool(
    isProduction && process.env.DB_HOST
      ? {
          host: process.env.DB_HOST,
          port: Number(process.env.DB_PORT ?? 6543),
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME ?? "postgres",
          ssl: { rejectUnauthorized: false },
          max: 2,
        }
      : {
          connectionString: process.env.DATABASE_URL!,
          max: 2,
        }
  );
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter } as any);
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
