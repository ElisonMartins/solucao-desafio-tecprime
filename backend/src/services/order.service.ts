import { prisma } from "../lib/prisma";
import { Prisma } from "@prisma/client";

type CreateOrderDTO = {
  name: string;
  email: string;

  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  complement?: string;

  paymentMethod: "Pix" | "Cartão" | "Boleto";

  userId: string;

  items: {
    productId: number;
    quantity: number;
    price: number; // vem do frontend
  }[];
};

export const createOrder = async (data: CreateOrderDTO) => {
  if (!data.items || data.items.length === 0) {
    throw new Error("Pedido precisa ter ao menos um item");
  }

  const validPayments = ["Pix", "Cartão", "Boleto"];
  if (!validPayments.includes(data.paymentMethod)) {
    throw new Error("Forma de pagamento inválida");
  }

  // Calcular total
  const total = data.items.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);

  const order = await prisma.$transaction(async (tx) => {
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
      data: data.items.map((item) => ({
        orderId: createdOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: new Prisma.Decimal(item.price),
      })),
    });

    return createdOrder;
  });

  return order;
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