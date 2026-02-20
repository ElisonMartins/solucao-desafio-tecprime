import { prisma } from "../lib/prisma";

export const addToCart = async (
  userId: string,
  productId: number,
  quantity: number
) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) throw new Error("Carrinho não encontrado");

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: cart.id,
      productId,
    },
  });

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: existingItem.quantity + quantity,
      },
    });
  }

  return prisma.cartItem.create({
    data: {
      cartId: cart.id,
      productId,
      quantity,
    },
  });
};

export const getCartByUser = async (userId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true },
  });

  if (!cart) throw new Error("Carrinho não encontrado");

  return cart;
};

export const updateCartItem = async (
  userId: string,
  itemId: string,
  quantity: number
) => {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!item || item.cart.userId !== userId) {
    throw new Error("Item não encontrado");
  }

  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });
};

export const removeCartItem = async (
  userId: string,
  itemId: string
) => {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!item || item.cart.userId !== userId) {
    throw new Error("Item não encontrado");
  }

  return prisma.cartItem.delete({
    where: { id: itemId },
  });
};