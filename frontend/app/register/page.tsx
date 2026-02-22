"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { registerUser } from "@/services/auth.service";

interface ApiError {
  message: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser({ name, email, password });

      toast.success("Conta criada com sucesso!");

      setTimeout(() => {
        router.push("/login");
      }, 800);
    } catch (error: unknown) {
      const err = error as AxiosError<ApiError>;

      if (err.response?.status === 409) {
        toast.error("E-mail já está em uso.");
      } else if (err.response?.status === 400) {
        toast.error(err.response?.data?.message || "Dados inválidos.");
      } else {
        toast.error("Erro ao registrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl w-full max-w-md space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-gray-900">
          Criar Conta
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            required
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? "Registrando..." : "Registrar"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Já possui conta?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Fazer login
          </Link>
        </p>
      </form>
    </div>
  );
}
