import Image from "next/image";
import { Product } from "@/types/product";
import Button from "@/components/Button";

type Props = {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
};

export default function ProductCard({ product, onSelect, onAddToCart }: Props) {
  return (
    <div
      onClick={() => onSelect(product)}
      className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col h-full cursor-pointer"
    >
      <div className="relative w-full h-56 bg-gray-50">
        <Image
          src={product.imagem}
          alt={product.nome}
          fill
          className="object-contain p-6"
        />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h2 className="font-semibold text-title text-lg leading-tight line-clamp-2 min-h-2">
          {product.nome}
        </h2>

        <p className="text-description text-sm line-clamp-2 min-h-2 mt-2">
          {product.descricao}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 gap-3">
          <span className="text-2xl font-bold text-gray-900">
            R$ {product.preco.toFixed(2)}
          </span>

          <div
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
          >
            <Button>Adicionar ao carrinho</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
