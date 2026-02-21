import { Request, Response } from "express";
import { createOrder, getOrderById } from "../services/order.service";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const order = await createOrder(req.body);

    return res.status(201).json({
      message: "Pedido criado com sucesso",
      orderId: order.id,
    });
  } catch (error: any) {
    return res.status(400).json({
      error: error.message || "Erro ao criar pedido",
    });
  }
};

export const getOrderByIdController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const order = await getOrderById(Array.isArray(id) ? id[0] : id);

    return res.json(order);
  } catch (error: any) {
    return res.status(404).json({
      error: error.message || "Pedido não encontrado",
    });
  }
};