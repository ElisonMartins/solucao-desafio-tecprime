"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import { useState } from "react";
import { useRouter } from "next/navigation";
import QuantitySelector from "@/components/QuantitySelector";
import { addToCart } from "@/services/cart.service";
import { FiX } from "react-icons/fi";
import { toast } from "sonner";

type Props = {
  product: Product | null;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: Props) {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  if (!product) return null;

  const estoqueDisponivel = product.estoque > 0;

  const resetAndClose = () => {
    setQuantity(1);
    onClose();
  };

  const handleAdd = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      await addToCart(product.id, quantity);

      window.dispatchEvent(new CustomEvent("cartUpdated"));

      resetAndClose();
    } catch {
      toast.error("Erro ao adicionar ao carrinho.");
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

      window.dispatchEvent(new CustomEvent("cartUpdated"));

      setQuantity(1);
      router.push("/cart");
    } catch {
      toast.error("Erro ao adicionar ao carrinho.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 z-50 text-red-400 hover:text-red-600 transition cursor-pointer"
        >
          <FiX size={24} />
        </button>

        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-4 md:p-8">
          <div className="relative w-full h-60 md:h-80">
            <Image
              src={product.imagem}
              alt={product.nome}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
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

          <div className="flex items-center gap-3">
            {estoqueDisponivel ? (
              <>
                <p className="text-gray-500 text-sm">
                  {product.estoque} unidades em estoque
                </p>

                {product.estoque <= 5 && (
                  <span className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded-full">
                    Últimas unidades
                  </span>
                )}
              </>
            ) : (
              <p className="text-red-500 text-sm font-medium">
                Produto esgotado
              </p>
            )}
          </div>

          {estoqueDisponivel && (
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              max={product.estoque}
            />
          )}

          <div className="flex gap-3 mt-2">
            <button
              onClick={handleAdd}
              disabled={!estoqueDisponivel}
              className={`flex-1 py-3 rounded-xl transition cursor-pointer ${
                estoqueDisponivel
                  ? "bg-black text-white hover:opacity-90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Adicionar ao carrinho
            </button>

            <button
              onClick={handleBuyNow}
              disabled={!estoqueDisponivel}
              className={`flex-1 border py-3 rounded-xl transition cursor-pointer ${
                estoqueDisponivel
                  ? "border-black text-black hover:bg-gray-100"
                  : "border-gray-300 text-gray-400 cursor-not-allowed"
              }`}
            >
              Comprar agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
