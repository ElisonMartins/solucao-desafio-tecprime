"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import { useState } from "react";
import { useRouter } from "next/navigation";
import QuantitySelector from "@/components/QuantitySelector";
import { addToCart } from "@/services/cart.service";

type Props = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: Props) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  if (!product) return null;

  const handleAdd = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await addToCart(product.id, quantity);
      onClose();
    } catch {
      alert("Erro ao adicionar ao carrinho");
    }
  };

  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await addToCart(product.id, quantity);
      router.push("/cart");
    } catch {
      alert("Erro ao adicionar ao carrinho");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-xl z-10"
        >
          ✕
        </button>

        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-4 md:p-8">
          <div className="relative w-full h-60 md:h-80">
            <Image
              src={product.imagem}
              alt={product.nome}
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="w-full md:w-1/2 p-5 md:p-8 flex flex-col gap-4">
          <h2 className="text-xl md:text-2xl font-bold">{product.nome}</h2>

          <p className="text-gray-600 text-sm md:text-base">
            {product.descricao}
          </p>

          <div className="text-2xl md:text-3xl font-bold text-black">
            R$ {product.preco.toFixed(2)}
          </div>

          <QuantitySelector value={quantity} onChange={setQuantity} />

          <div className="flex gap-3 mt-2">
            <button
              onClick={handleAdd}
              className="flex-1 bg-black text-white py-3 rounded-xl hover:opacity-90 transition"
            >
              Adicionar
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 border border-black text-black py-3 rounded-xl hover:bg-gray-100 transition"
            >
              Comprar agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
