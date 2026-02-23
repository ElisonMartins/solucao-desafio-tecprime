import { prisma } from "../lib/prisma";
import { logger } from "../lib/logger";

export const addToCart = async (
  userId: string,
  productId: number,
  quantity: number
) => {
  logger.info(
    { userId, productId, quantity },
    "Add to cart attempt"
  );

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      logger.warn({ userId }, "Cart not found");
      throw new Error("Carrinho não encontrado");
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      const updated = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });

      logger.info(
        { userId, productId, newQuantity: updated.quantity },
        "Cart item quantity updated"
      );

      return updated;
    }

    const created = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
      },
    });

    logger.info(
      { userId, productId, quantity },
      "Cart item created"
    );

    return created;
  } catch (error) {
    logger.error(
      { userId, productId, error },
      "Error adding item to cart"
    );
    throw error;
  }
};

export const getCartByUser = async (userId: string) => {
  logger.info({ userId }, "Fetching user cart");

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    if (!cart) {
      logger.warn({ userId }, "Cart not found");
      throw new Error("Carrinho não encontrado");
    }

    return cart;
  } catch (error) {
    logger.error({ userId, error }, "Error fetching cart");
    throw error;
  }
};

export const updateCartItem = async (
  userId: string,
  itemId: string,
  quantity: number
) => {
  logger.info(
    { userId, itemId, quantity },
    "Updating cart item"
  );

  try {
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== userId) {
      logger.warn({ userId, itemId }, "Cart item not found or unauthorized");
      throw new Error("Item não encontrado");
    }

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    logger.info(
      { userId, itemId, quantity },
      "Cart item updated successfully"
    );

    return updated;
  } catch (error) {
    logger.error(
      { userId, itemId, error },
      "Error updating cart item"
    );
    throw error;
  }
};

export const removeCartItem = async (
  userId: string,
  itemId: string
) => {
  logger.info({ userId, itemId }, "Removing cart item");

  try {
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== userId) {
      logger.warn({ userId, itemId }, "Cart item not found or unauthorized");
      throw new Error("Item não encontrado");
    }

    const deleted = await prisma.cartItem.delete({
      where: { id: itemId },
    });

    logger.info({ userId, itemId }, "Cart item removed");

    return deleted;
  } catch (error) {
    logger.error(
      { userId, itemId, error },
      "Error removing cart item"
    );
    throw error;
  }
};

export const clearCart = async (userId: string) => {
  logger.info({ userId }, "Clearing cart");

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      logger.warn({ userId }, "Cart not found");
      throw new Error("Carrinho não encontrado");
    }

    const result = await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    logger.info(
      { userId, deletedItems: result.count },
      "Cart cleared successfully"
    );

    return result;
  } catch (error) {
    logger.error({ userId, error }, "Error clearing cart");
    throw error;
  }
};