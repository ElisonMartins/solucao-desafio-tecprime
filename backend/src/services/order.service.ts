import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";
import { CreateOrderInput } from "../validators/order.schema";

export const createOrder = async (data: CreateOrderInput) => {
  return prisma.$transaction(async (tx) => {
    let total = 0;

    const validatedItems = [];

    for (const item of data.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Produto ${item.productId} não encontrado`);
      }

      if (product.stock < item.quantity) {
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

    return createdOrder;
  });
};

export const getOrderById = async (id: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
    },
  });

  if (!order) {
    throw new Error("Pedido não encontrado");
  }

  return order;
};