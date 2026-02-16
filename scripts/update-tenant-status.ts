import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Updating tenant status...");

  // Get all tenants and update them
  const tenants = await prisma.tenant.findMany();
  
  let updated = 0;
  for (const tenant of tenants) {
    if (!tenant.status || tenant.status === "") {
      await prisma.tenant.update({
        where: { id: tenant.id },
        data: { status: "active" },
      });
      updated++;
    }
  }

  console.log(`Updated ${updated} tenants to active status`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
