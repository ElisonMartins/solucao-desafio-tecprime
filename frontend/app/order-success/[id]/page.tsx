"use client";

import { useParams, useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import Header from "@/components/Header";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const router = useRouter();

  return (
    <>
      <Header />

      <div className="max-w-3xl mx-auto p-6">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition mb-6 cursor-pointer"
        >
          <FiArrowLeft size={30} />
        </button>

        <div className="text-center mt-10">
          <h1 className="text-3xl font-bold mb-4">
            Pedido realizado com sucesso 🎉
          </h1>
          <p className="text-lg">Número do pedido:</p>
          <p className="text-2xl font-bold mt-2">{id}</p>
        </div>
      </div>
    </>
  );
}
