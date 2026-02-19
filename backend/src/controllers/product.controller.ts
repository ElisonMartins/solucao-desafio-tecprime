import { Request, Response } from "express";
import { getNormalizedProducts } from "../services/product.service";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await getNormalizedProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar produtos" });
  }
};
