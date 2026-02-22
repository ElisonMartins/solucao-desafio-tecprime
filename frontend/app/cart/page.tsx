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
import { FiTrash2, FiArrowLeft } from "react-icons/fi";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

import { CartItem, MergedCartItem } from "@/types/carts";
import { Product } from "@/types/product";

export default function CartPage() {
  const router = useRouter();

  const [items, setItems] = useState<MergedCartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [cep, setCep] = useState("");
  const [cepValido, setCepValido] = useState(false);

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
        .filter(Boolean) as MergedCartItem[];

      setItems(merged);
    } catch (error) {
      console.error("Erro ao carregar carrinho");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    if (newQuantity <= 0) return;

    // Proteção contra ultrapassar estoque
    if (newQuantity > item.product.stock) return;

    await updateCartItem(itemId, newQuantity);

    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity: newQuantity } : i)),
    );

    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const handleRemove = async (itemId: string) => {
    await removeCartItem(itemId);

    setItems((prev) => prev.filter((item) => item.id !== itemId));

    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const handleCepChange = (value: string) => {
    const numeric = value.replace(/\D/g, "");

    if (numeric.length > 8) return;

    const masked =
      numeric.length > 5
        ? `${numeric.slice(0, 5)}-${numeric.slice(5)}`
        : numeric;

    setCep(masked);
    setCepValido(numeric.length === 8);
  };

  const total = items.reduce(
    (acc, item) => acc + Number(item.product.price) * item.quantity,
    0,
  );

  if (loading) return <Loader />;

  return (
    <>
      <Header />

      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition mb-6 cursor-pointer"
        >
          <FiArrowLeft size={30} />
        </button>

        <h2 className="text-3xl font-bold mb-8">Seu Carrinho</h2>

        {items.length === 0 && <p>Carrinho vazio.</p>}

        {items.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-6 border-b pb-6">
                  <div className="relative w-28 h-28 bg-gray-50 rounded-lg">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      sizes="112px"
                      className="object-contain p-3"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="font-semibold text-lg">
                        {item.product.name}
                      </h2>

                      <p className="text-gray-500">
                        R$ {Number(item.product.price).toFixed(2)}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {item.product.stock} em estoque
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <QuantitySelector
                        value={item.quantity}
                        max={item.product.stock}
                        onChange={(value) =>
                          handleQuantityChange(item.id, value)
                        }
                      />

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="font-semibold text-right">
                    R${(Number(item.product.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl h-fit sticky top-24">
              <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>

              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between mb-4">
                <span>Frete</span>
                <span
                  className={`font-semibold ${
                    cepValido ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {cepValido ? "Grátis" : "Calcule o frete"}
                </span>
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-600">Calcular frete</label>

                <input
                  type="text"
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 mt-2 focus:outline-none"
                />

                {cepValido && (
                  <p className="text-green-600 text-sm mt-2 font-medium">
                    Frete grátis para sua região 🎉
                  </p>
                )}
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span>R$ {total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => router.push("/checkout")}
                className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition cursor-pointer"
              >
                Continuar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
