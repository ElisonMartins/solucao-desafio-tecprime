"use client";

import { useEffect, useState } from "react";
import {
  getCart,
  updateCartItem,
  removeCartItem,
} from "@/services/cart.service";
import { getProducts } from "@/services/product.service";
import QuantitySelector from "@/components/QuantitySelector";
import Image from "next/image";

type CartItem = {
  id: string;
  productId: number;
  quantity: number;
};

type Product = {
  id: number;
  nome: string;
  preco: number;
  imagem: string;
};

type MergedItem = CartItem & { product: Product };

export default function CartPage() {
  const [items, setItems] = useState<MergedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const cart = await getCart();
      const products = await getProducts();

      const merged = cart.items
        .map((item: CartItem) => {
          const product = products.find(
            (p: Product) => p.id === item.productId,
          );
          if (!product) return null;
          return { ...item, product };
        })
        .filter(Boolean) as MergedItem[];

      setItems(merged);
    } catch (error) {
      console.error("Erro ao carregar carrinho");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) return;

    await updateCartItem(itemId, newQuantity);

    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  const handleRemove = async (itemId: string) => {
    await removeCartItem(itemId);
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const total = items.reduce(
    (acc, item) => acc + item.product.preco * item.quantity,
    0,
  );

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Seu Carrinho</h1>

      {items.length === 0 && <p>Carrinho vazio.</p>}

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 items-center border-b pb-4">
            <div className="relative w-24 h-24">
              <Image
                src={item.product.imagem}
                alt={item.product.nome}
                fill
                className="object-contain"
              />
            </div>

            <div className="flex-1">
              <h2 className="font-semibold">{item.product.nome}</h2>

              <p className="text-gray-500">
                R$ {item.product.preco.toFixed(2)}
              </p>

              <div className="mt-3">
                <QuantitySelector
                  value={item.quantity}
                  onChange={(value) => handleQuantityChange(item.id, value)}
                />
              </div>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                R$ {(item.product.preco * item.quantity).toFixed(2)}
              </p>

              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-500 text-sm mt-2"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-8 text-right">
          <h2 className="text-xl font-bold">Total: R$ {total.toFixed(2)}</h2>

          <button className="mt-4 bg-black text-white px-6 py-3 rounded-xl">
            Finalizar Compra
          </button>
        </div>
      )}
    </div>
  );
}
