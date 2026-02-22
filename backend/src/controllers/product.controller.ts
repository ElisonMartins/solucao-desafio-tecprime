import { Request, Response } from "express";
import { syncProducts, getProducts } from "../services/product.service";

export const getProductsController = async (req: Request, res: Response) => {
  try {
    // Garante que os produtos estejam sincronizados
    await syncProducts();

    const products = await getProducts();

    return res.json(products);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao buscar produtos",
    });
  }
};