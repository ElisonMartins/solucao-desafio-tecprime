"use client";

import { CheckoutFormData } from "@/types/order";

type Props = {
  form: CheckoutFormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onCepChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
};

export default function CheckoutForm({
  form,
  onChange,
  onCepChange,
  onSubmit,
  submitting,
}: Props) {
  return (
    <>
      <div className="space-y-6">
        {/* Nome / Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Nome completo"
            className="input"
          />
          <input
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="E-mail"
            className="input"
          />
        </div>

        {/* Rua */}
        <input
          name="street"
          value={form.street}
          onChange={onChange}
          placeholder="Rua"
          className="input"
        />

        {/* Número / CEP */}
        <div className="grid grid-cols-2 gap-4">
          <input
            name="number"
            value={form.number}
            onChange={onChange}
            placeholder="Número"
            className="input"
          />

          <input
            value={form.cep}
            onChange={(e) => onCepChange(e.target.value)}
            placeholder="CEP"
            className="input"
          />
        </div>

        {/* Bairro */}
        <input
          name="neighborhood"
          value={form.neighborhood}
          onChange={onChange}
          placeholder="Bairro"
          className="input"
        />

        {/* Cidade / Estado */}
        <div className="grid grid-cols-2 gap-4">
          <input
            name="city"
            value={form.city}
            onChange={onChange}
            placeholder="Cidade"
            className="input"
          />
          <input
            name="state"
            value={form.state}
            onChange={onChange}
            placeholder="Estado"
            className="input"
          />
        </div>

        {/* Complemento */}
        <input
          name="complement"
          value={form.complement}
          onChange={onChange}
          placeholder="Complemento (opcional)"
          className="input"
        />

        <select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={onChange}
          className="input"
        >
          <option value="Pix">Pix</option>
          <option value="Cartão">Cartão</option>
          <option value="Boleto">Boleto</option>
        </select>

        <button
          onClick={onSubmit}
          disabled={submitting}
          className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition cursor-pointer disabled:cursor-not-allowed"
        >
          {submitting ? "Processando..." : "Confirmar Pedido"}
        </button>
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
