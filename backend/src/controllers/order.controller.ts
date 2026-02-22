import { Request, Response } from "express";
import { createOrder, getOrderById } from "../services/order.service";
import { createOrderSchema } from "../validators/order.schema";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    // Validação com Zod
    const validatedData = createOrderSchema.parse(req.body);

    const order = await createOrder(validatedData);

    return res.status(201).json({
      message: "Pedido criado com sucesso",
      orderId: order.id,
    });
  } catch (error: any) {
    return res.status(400).json({
      error: error.errors ?? error.message ?? "Erro ao criar pedido",
    });
  }
};

export const getOrderByIdController = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;

    const order = await getOrderById(id);

    return res.json(order);
  } catch (error: any) {
    return res.status(404).json({
      error: error.message ?? "Pedido não encontrado",
    });
  }
};