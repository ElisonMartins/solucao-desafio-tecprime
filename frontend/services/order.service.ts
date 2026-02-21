import { api } from "./api";

export type CreateOrderDTO = {
  userId: string;
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
  items: {
    productId: number;
    quantity: number;
    price: number;
  }[];
};

export const createOrder = async (data: CreateOrderDTO) => {
  const response = await api.post("/orders", data);
  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};