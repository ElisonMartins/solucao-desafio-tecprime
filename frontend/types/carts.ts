import { Product } from "./product";

export interface CartItem {
  id: string;
  productId: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

export type MergedCartItem = CartItem & {
  product: Product;
};