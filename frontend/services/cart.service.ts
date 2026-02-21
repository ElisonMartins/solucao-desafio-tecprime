import { api } from "./api";

export const addToCart = async (
  productId: number,
  quantity: number
) => {
  const response = await api.post("/cart/items", {
    productId,
    quantity,
  });

  return response.data;
};

export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const updateCartItem = async (
  itemId: string,
  quantity: number
) => {
  const response = await api.patch(`/cart/items/${itemId}`, {
    quantity,
  });

  return response.data;
};

export const removeCartItem = async (itemId: string) => {
  const response = await api.delete(`/cart/items/${itemId}`);
  return response.data;
};

export const clearCart = async () => {
  const response = await api.delete("/cart/clear");
  return response.data;
};