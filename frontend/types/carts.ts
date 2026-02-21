import { Product } from "./product";

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}

export type MergedCartItem = CartItem & {
  product: Product;
};