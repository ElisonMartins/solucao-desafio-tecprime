import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";
import { fetchFakeStoreProducts } from "../integrations/fakestore.integration";
import { logger } from "../lib/logger";

export const syncProducts = async () => {
  logger.info("Starting product synchronization");

  try {
    const existing = await prisma.product.findMany();

    if (existing.length > 0) {
      logger.info(
        { count: existing.length },
        "Products already exist in database"
      );
      return existing;
    }

    logger.info("Fetching products from external API");

    const apiProducts = await fetchFakeStoreProducts();

    // Normalização dos dados
    const normalized = apiProducts.map((p: any) => ({
      id: p.id,
      name: p.title,
      description: p.description,
      price: new Prisma.Decimal((p.price * 5).toFixed(2)),
      stock: 30, // Estoque inicial fixo
      image: p.image,
    }));

    await prisma.product.createMany({
      data: normalized,
    });

    logger.info(
      { count: normalized.length },
      "Products synchronized and saved successfully"
    );

    return normalized;
  } catch (error) {
    logger.error({ error }, "Error during product synchronization");
    throw error;
  }
};

// Estoque
export const getProducts = async () => {
  logger.info("Fetching products from database");

  try {
    const products = await prisma.product.findMany({
      orderBy: {
        id: "asc",
      },
    });

    logger.info(
      { count: products.length },
      "Products fetched successfully"
    );

    return products;
  } catch (error) {
    logger.error({ error }, "Error fetching products");
    throw error;
  }
};