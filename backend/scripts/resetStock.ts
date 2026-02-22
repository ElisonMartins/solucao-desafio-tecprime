import { prisma } from "../src/lib/prisma";

//reseta o estoque
async function main() {
  await prisma.product.updateMany({
    data: {
      stock: 30,
    },
  });

  console.log("Estoque resetado para 30.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());