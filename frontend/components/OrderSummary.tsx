"use client";

import Image from "next/image";
import { MergedCartItem } from "@/types/carts";

type Props = {
  items: MergedCartItem[];
};

export default function OrderSummary({ items }: Props) {
  const total = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

  return (
    <div className="bg-gray-50 p-6 rounded-2xl h-fit">
      <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>

      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-4 mb-4"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Image
              src={item.product.image}
              alt={item.product.name}
              width={56}
              height={56}
              className="object-cover rounded-lg border"
            />

            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">
                {item.product.name}
              </span>
              <span className="text-xs text-gray-500">
                Quantidade: {item.quantity}
              </span>
            </div>
          </div>

          <span className="text-sm font-semibold shrink-0">
            R$ {(item.product.price * item.quantity).toFixed(2)}
          </span>
        </div>
      ))}

      <hr className="my-4" />

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>R$ {total.toFixed(2)}</span>
      </div>
    </div>
  );
}
