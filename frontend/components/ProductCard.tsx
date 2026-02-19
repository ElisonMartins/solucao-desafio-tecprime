import Image from "next/image";
import { Product } from "@/types/product";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col hover:shadow-lg transition">
      <div className="relative h-40 mb-4">
        <Image
          src={product.imagem}
          alt={product.nome}
          fill
          className="object-contain"
        />
      </div>

      <h2 className="font-semibold text-lg line-clamp-2 text-black">
        {product.nome}
      </h2>

      <p className="text-gray-500 text-sm line-clamp-2">{product.descricao}</p>

      <div className="mt-3">
        <span className="text-blue-600 font-bold text-xl">
          R$ {product.preco.toFixed(2)}
        </span>
      </div>

      <button className="mt-auto bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
        Adicionar ao carrinho
      </button>
    </div>
  );
}
