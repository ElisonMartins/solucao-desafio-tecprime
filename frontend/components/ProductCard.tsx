"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import Button from "@/components/Button";

type Props = {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
};

export default function ProductCard({ product, onSelect, onAddToCart }: Props) {
  const stockAvailable = product.stock > 0;

  return (
    <div
      onClick={() => {
        if (stockAvailable) {
          onSelect(product);
        }
      }}
      className={`bg-white rounded-2xl shadow-md transition overflow-hidden flex flex-col h-full
    ${stockAvailable ? "cursor-pointer hover:shadow-lg" : "cursor-not-allowed opacity-90"}
  `}
    >
      <div className="relative w-full h-56 bg-gray-50">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-contain p-6"
        />

        {!stockAvailable && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
              Esgotado
            </span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h2 className="font-semibold text-title text-lg leading-tight line-clamp-2 min-h-2">
          {product.name}
        </h2>

        <p className="text-description text-sm line-clamp-2 min-h-2 mt-2">
          {product.description}
        </p>

        {stockAvailable && product.stock <= 5 && (
          <span className="text-xs text-amber-600 mt-2 font-medium">
            Últimas {product.stock} unidades
          </span>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 gap-3">
          <span className="text-xl md:text-2xl font-bold text-gray-900">
            R$ {Number(product.price).toFixed(2)}
          </span>

          <div
            onClick={(e) => {
              e.stopPropagation();
              if (stockAvailable) {
                onAddToCart(product);
              }
            }}
          >
            <Button>
              {stockAvailable ? "Adicionar ao carrinho" : "Esgotado"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
