"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { FiArrowLeft } from "react-icons/fi";
import Header from "@/components/Header";
import CheckoutForm from "@/components/CheckoutForm";
import OrderSummary from "@/components/OrderSummary";
import Loader from "@/components/Loader";

import { getCart, clearCart } from "@/services/cart.service";
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
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCepChange = (value: string) => {
    const numeric = value.replace(/\D/g, "");
    if (numeric.length > 8) return;

    const masked =
      numeric.length > 5
        ? `${numeric.slice(0, 5)}-${numeric.slice(5)}`
        : numeric;

    setForm((prev) => ({
      ...prev,
      cep: masked,
    }));

    setCepValido(numeric.length === 8);
  };

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

      // Limpa o carrrinho
      await clearCart();
      // atualiza o badge do header
      window.dispatchEvent(new CustomEvent("cartUpdated"));

      toast.success("Pedido realizado com sucesso!");
      router.push(`/order-success/${response.orderId}`);
    } catch {
      toast.error("Erro ao finalizar pedido.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

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

            <CheckoutForm
              form={form}
              onChange={handleChange}
              onCepChange={handleCepChange}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          </div>

          <OrderSummary items={items} />
        </div>
      </div>
    </>
  );
}
