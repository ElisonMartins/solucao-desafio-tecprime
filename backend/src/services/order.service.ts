import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";
import { CreateOrderInput } from "../validators/order.schema";
import { logger } from "../lib/logger";

export const createOrder = async (data: CreateOrderInput) => {
  logger.info(
    { userId: data.userId, itemsCount: data.items.length },
    "Starting order creation"
  );

  try {
    return await prisma.$transaction(async (tx) => {
      let total = 0;
      const validatedItems = [];

      for (const item of data.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          logger.warn(
            { productId: item.productId },
            "Product not found during order creation"
          );
          throw new Error(`Produto ${item.productId} não encontrado`);
        }

        if (product.stock < item.quantity) {
          logger.warn(
            {
              productId: product.id,
              availableStock: product.stock,
              requestedQuantity: item.quantity,
            },
            "Insufficient stock"
          );
          throw new Error(`Estoque insuficiente para ${product.name}`);
        }

        const itemTotal = Number(product.price) * item.quantity;
        total += itemTotal;

        validatedItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: product.price,
        });

        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - item.quantity,
          },
        });
      }

      const createdOrder = await tx.order.create({
        data: {
          userId: data.userId,
          name: data.name,
          email: data.email,
          street: data.street,
          number: data.number,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          cep: data.cep,
          complement: data.complement,
          paymentMethod: data.paymentMethod,
          total: new Prisma.Decimal(total),
        },
      });

      await tx.orderItem.createMany({
        data: validatedItems.map((item) => ({
          orderId: createdOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      logger.info(
        { orderId: createdOrder.id, total },
        "Order created successfully"
      );

      return createdOrder;
    });
  } catch (error) {
    logger.error(
      { error, userId: data.userId },
      "Error occurred during order creation"
    );
    throw error;
  }
};

export const getOrderById = async (id: string) => {
  logger.info({ orderId: id }, "Fetching order by ID");

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });

  if (!order) {
    logger.warn({ orderId: id }, "Order not found");
    throw new Error("Pedido não encontrado");
  }

  logger.info({ orderId: id }, "Order fetched successfully");

  return order;
};