"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  name: string;
};

export default function Header() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const updateUser = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUserName(null);
        return;
      }

      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUserName(decoded.name);
      } catch {
        setUserName(null);
      }
    };

    updateUser();
    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const truncateName = (name: string) => {
    return name.length > 20 ? name.slice(0, 20) + "..." : name;
  };

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-semibold tracking-tight">
          Shop
        </h1>

        {!userName ? (
          <button
            onClick={() => router.push("/login")}
            className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition"
          >
            <FaUser className="text-sm" />
            <span className="text-sm font-medium">Entrar</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-base md:text-lg font-medium text-gray-800">
            <span>Olá, {truncateName(userName)}</span>
          </div>
        )}
      </div>
    </header>
  );
}
