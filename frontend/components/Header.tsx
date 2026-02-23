"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { jwtDecode } from "jwt-decode";
import { getCart } from "@/services/cart.service";
import { Cart } from "@/types/carts";

type DecodedToken = {
  name: string;
};

export default function Header() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const loadUserAndCart = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUserName(null);
        setCartCount(0);
        return;
      }

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserName(decoded.name);

        const cart: Cart = await getCart();

        const totalItens = cart.items.reduce(
          (acc, item) => acc + item.quantity,
          0,
        );

        setCartCount(totalItens);
      } catch {
        setUserName(null);
        setCartCount(0);
      }
    };

    loadUserAndCart();

    const handleCartUpdate = () => {
      loadUserAndCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserName(null);
    setCartCount(0);
    router.push("/");
  };

  const truncateName = (name: string) => {
    return name.length > 20 ? name.slice(0, 20) + "..." : name;
  };

  const formattedCount = cartCount > 9 ? "9+" : cartCount;

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <h1
          onClick={() => router.push("/")}
          className="text-lg md:text-xl font-semibold tracking-tight cursor-pointer"
        >
          Shop
        </h1>

        <div className="flex items-center gap-6">
          {!userName ? (
            <button
              onClick={() => router.push("/login")}
              className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
            >
              <FaUser className="text-sm" />
              <span className="text-sm font-medium">Entrar</span>
            </button>
          ) : (
            <>
              <span className="text-base md:text-lg font-medium text-gray-800">
                Olá, {truncateName(userName)}
              </span>

              <button
                onClick={() => router.push("/order-search")}
                className="text-sm text-gray-500 hover:text-black transition cursor-pointer"
              >
                Pedidos
              </button>

              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-black transition cursor-pointer"
              >
                Sair
              </button>

              <button
                onClick={() => router.push("/cart")}
                className="relative cursor-pointer"
              >
                <FiShoppingCart size={22} />

                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs px-1.5 py-0.5 rounded-full">
                    {formattedCount}
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
