import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";
import { fetchFakeStoreProducts } from "../integrations/fakestore.integration";

export const syncProducts = async () => {
  const existing = await prisma.product.findMany();

  if (existing.length > 0) {
    return existing;
  }

  const apiProducts = await fetchFakeStoreProducts();
  //Normalização dos dados
  const normalized = apiProducts.map((p: any) => ({
    id: p.id,
    name: p.title,
    description: p.description,
    price: new Prisma.Decimal((p.price * 5).toFixed(2)),
    stock: 30,
    image: p.image,
  }));

  await prisma.product.createMany({
    data: normalized,
  });

  return normalized;
};

//Estoque
export const getProducts = async () => {
  return prisma.product.findMany({
    orderBy: {
      id: "asc",
    },
  });
};