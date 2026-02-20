export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}