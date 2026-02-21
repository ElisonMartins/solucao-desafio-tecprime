import { Request, Response } from "express";
import {
  addToCart,
  getCartByUser,
  updateCartItem,
  removeCartItem,
  clearCart
} from "./../services/cart.service";

export const addItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Dados inválidos" });
    }

    const item = await addToCart(userId, Number(productId), Number(quantity));
    res.status(201).json(item);
  } catch (error: any) {
  console.log("ERRO ADD CART:", error);
  res.status(400).json({ message: error.message });
} 
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const cart = await getCartByUser(userId);
    res.json(cart);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const itemId = String(req.params.itemId);
    const { quantity } = req.body;

    if (!quantity) {
      return res.status(400).json({ message: "Quantidade inválida" });
    }

    const item = await updateCartItem(userId, itemId, Number(quantity));
    res.json(item);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const removeItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const itemId = String(req.params.itemId);

    await removeCartItem(userId, itemId);
    res.json({ message: "Item removido com sucesso" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const clearCartItems = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    await clearCart(userId);

    res.json({ message: "Carrinho limpo com sucesso" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};