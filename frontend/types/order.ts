export type PaymentMethod = "Pix" | "Cartão" | "Boleto";

export interface CheckoutFormData {
  name: string;
  email: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
  complement: string;
  paymentMethod: PaymentMethod;
}

export interface CreateOrderItemDTO {
  productId: number;
  quantity: number;
  price: number;
}

export interface CreateOrderDTO extends CheckoutFormData {
  userId: string;
  items: CreateOrderItemDTO[];
}

export interface CreateOrderResponse {
  message: string;
  orderId: string;
}