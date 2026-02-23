"use client";

import { useState } from "react";
import Header from "@/components/Header";
import { api } from "@/services/api";
import { OrderDetails } from "@/types/order";

export default function OrderSearchPage() {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!orderId.trim()) return;

    try {
      setLoading(true);
      setError("");
      setOrder(null);

      const response = await api.get<OrderDetails>(`/orders/${orderId}`);
      setOrder(response.data);
    } catch {
      setError("Pedido não encontrado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <div className="max-w-4xl mx-auto p-6 space-y-10">
        {/* busca */}
        <div className="max-w-md mx-auto space-y-4 text-center mt-5">
          <h1 className="text-3xl font-bold">Consultar Pedido</h1>

          <p className="text-gray-500 text-sm">
            Digite o codigo do pedido para visualizar os detalhes.
          </p>

          <input
            type="text"
            placeholder="Número do pedido"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:border-black"
          />

          <button
            onClick={handleSearch}
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Buscando..." : "Buscar Pedido"}
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* resultado */}
        {order && (
          <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
            <h2 className="text-2xl font-semibold">Detalhes do Pedido</h2>

            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <p>
                <strong>ID:</strong> {order.id}
              </p>
              <p>
                <strong>Pagamento:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>Nome:</strong> {order.name}
              </p>
              <p>
                <strong>Email:</strong> {order.email}
              </p>
              <p>
                <strong>Total:</strong> R$ {Number(order.total).toFixed(2)}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Itens do Pedido</h3>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between border-b pb-2 text-sm"
                  >
                    <span>Produto #{item.productId}</span>
                    <span>
                      {item.quantity}x — R$ {Number(item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
