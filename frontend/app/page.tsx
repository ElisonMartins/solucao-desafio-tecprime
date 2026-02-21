"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { getProducts } from "@/services/product.service";
import { addToCart } from "@/services/cart.service";
import { Product } from "@/types/product";
import ProductCard from "@/components/ProductCard";
import ProductModal from "@/components/ProductModal";
import Header from "@/components/Header";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const router = useRouter();

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);

      window.dispatchEvent(new CustomEvent("cartUpdated"));

      toast.success("Produto adicionado ao carrinho");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Faça login para adicionar ao carrinho");
          router.push("/login");
        } else {
          toast.error("Erro ao adicionar ao carrinho");
        }
      } else {
        toast.error("Erro inesperado");
      }
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl text-title font-bold mb-8">Produtos</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </main>

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
