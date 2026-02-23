"use client";

import { useParams, useRouter } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";
import Header from "@/components/Header";

export default function OrderSuccessPage() {
  const { id } = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md rounded-2xl p-8 sm:p-10 text-center space-y-6">
            <FiCheckCircle size={72} className="mx-auto text-green-500" />

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold">
                Pedido confirmado!
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Seu pedido foi recebido com sucesso.
              </p>
            </div>

            <div className="bg-gray-100 rounded-xl py-4 px-6">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Número do pedido
              </p>
              <p className="text-xl font-bold mt-1">{id}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => router.push("/order-search")}
                className="w-full px-5 py-3 bg-black text-white rounded-xl hover:opacity-90 transition cursor-pointer"
              >
                Consultar Pedido
              </button>

              <button
                onClick={() => router.push("/")}
                className="w-full px-5 py-3 border border-black rounded-xl hover:bg-gray-100 transition cursor-pointer"
              >
                Voltar para loja
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
