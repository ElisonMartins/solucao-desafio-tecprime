import { api } from "./api";

export const createOrder = async (paymentMethod: string) => {
  const response = await api.post("/orders", {
    paymentMethod,
  });

  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};