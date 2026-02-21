"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { FiArrowLeft } from "react-icons/fi";
import Header from "@/components/Header";
import { getCart } from "@/services/cart.service";
import { getProducts } from "@/services/product.service";
import { createOrder } from "@/services/order.service";
import { toast } from "sonner";

import { CartItem, MergedCartItem } from "@/types/carts";
import { Product } from "@/types/product";
import { DecodedToken } from "@/types/auth";
import { CheckoutFormData } from "@/types/order";

export default function CheckoutPage() {
  const router = useRouter();

  const [items, setItems] = useState<MergedCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cepValido, setCepValido] = useState(false);

  const [form, setForm] = useState<CheckoutFormData>({
    name: "",
    email: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    cep: "",
    complement: "",
    paymentMethod: "Pix",
  });

  useEffect(() => {
    loadCart();
    loadUser();
  }, []);

  const loadUser = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      setForm((prev) => ({
        ...prev,
        name: decoded.name,
        email: decoded.email,
      }));
    } catch {
      toast.error("Sessão inválida. Faça login novamente.");
    }
  };

  const loadCart = async () => {
    try {
      const cart = await getCart();
      const products = await getProducts();

      const merged = cart.items
        .map((item: CartItem) => {
          const product = products.find(
            (p: Product) => p.id === item.productId,
          );
          if (!product) return null;
          return { ...item, product };
        })
        .filter(Boolean) as MergedCartItem[];

      if (merged.length === 0) {
        router.push("/cart");
        return;
      }

      setItems(merged);
    } catch {
      toast.error("Erro ao carregar carrinho.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCepChange = (value: string) => {
    const numeric = value.replace(/\D/g, "");
    if (numeric.length > 8) return;

    const masked =
      numeric.length > 5
        ? `${numeric.slice(0, 5)}-${numeric.slice(5)}`
        : numeric;

    setForm({ ...form, cep: masked });
    setCepValido(numeric.length === 8);
  };

  const total = items.reduce(
    (acc, item) => acc + item.product.preco * item.quantity,
    0,
  );

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Você precisa estar logado.");
      router.push("/login");
      return;
    }

    if (
      !form.street ||
      !form.number ||
      !form.city ||
      !form.state ||
      !cepValido
    ) {
      toast.error("Preencha corretamente os dados de endereço.");
      return;
    }

    try {
      setSubmitting(true);

      const decoded = jwtDecode<DecodedToken>(token);

      const response = await createOrder({
        userId: decoded.userId,
        ...form,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.preco,
        })),
      });

      toast.success("Pedido realizado com sucesso!");
      router.push(`/order-success/${response.orderId}`);
    } catch {
      toast.error("Erro ao finalizar pedido.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6">Carregando...</p>;

  return (
    <>
      <Header />

      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={() => router.push("/cart")}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition mb-6 cursor-pointer"
        >
          <FiArrowLeft size={30} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-8">Checkout</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nome completo"
                  className="input"
                />
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="E-mail"
                  className="input"
                />
              </div>

              <input
                name="street"
                value={form.street}
                onChange={handleChange}
                placeholder="Rua"
                className="input"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="number"
                  value={form.number}
                  onChange={handleChange}
                  placeholder="Número"
                  className="input"
                />

                <input
                  value={form.cep}
                  onChange={(e) => handleCepChange(e.target.value)}
                  placeholder="CEP"
                  className="input"
                />
              </div>

              <input
                name="neighborhood"
                value={form.neighborhood}
                onChange={handleChange}
                placeholder="Bairro"
                className="input"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Cidade"
                  className="input"
                />
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Estado"
                  className="input"
                />
              </div>

              <input
                name="complement"
                value={form.complement}
                onChange={handleChange}
                placeholder="Complemento (opcional)"
                className="input"
              />

              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="input"
              >
                <option value="Pix">Pix</option>
                <option value="Cartão">Cartão</option>
                <option value="Boleto">Boleto</option>
              </select>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition"
              >
                {submitting ? "Processando..." : "Confirmar Pedido"}
              </button>
            </div>
          </div>

          {/* resumo do pedido */}
          <div className="bg-gray-50 p-6 rounded-2xl h-fit">
            <h2 className="text-xl font-bold mb-4">Resumo do Pedido</h2>

            {items.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>
                  {item.product.nome} x {item.quantity}
                </span>
                <span>
                  R$ {(item.product.preco * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}

            <hr className="my-4" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          padding: 12px;
          border-radius: 12px;
          outline: none;
          transition: all 0.2s;
        }

        .input:focus {
          border-color: black;
        }
      `}</style>
    </>
  );
}
