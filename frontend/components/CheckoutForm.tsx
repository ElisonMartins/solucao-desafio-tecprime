"use client";

import { CheckoutFormData } from "@/types/order";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import CreditCard from "@/components/CreditCard/index";

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
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  const [isFlipped, setIsFlipped] = useState(false);

  //mascaras

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    return cleaned;
  };

  const formatCVV = (value: string) => {
    return value.replace(/\D/g, "").slice(0, 3);
  };

  const handleSubmitWithValidation = () => {
    if (form.paymentMethod === "Cartão") {
      if (
        cardData.number.replace(/\s/g, "").length !== 16 ||
        cardData.expiry.length !== 5 ||
        cardData.cvv.length !== 3 ||
        !cardData.name
      ) {
        toast.error("Preencha corretamente os dados do cartão.");
        return;
      }
    }

    onSubmit();
  };

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

        <input
          name="street"
          value={form.street}
          onChange={onChange}
          placeholder="Rua"
          className="input"
        />

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

        <input
          name="neighborhood"
          value={form.neighborhood}
          onChange={onChange}
          placeholder="Bairro"
          className="input"
        />

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

        <input
          name="complement"
          value={form.complement}
          onChange={onChange}
          placeholder="Complemento (opcional)"
          className="input"
        />

        {/* Metodo de pagamento*/}
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

        {/* pix */}
        {form.paymentMethod === "Pix" && (
          <div className="border rounded-xl p-6 text-center space-y-4">
            <p className="font-semibold">Escaneie o QR Code para pagar</p>

            <Image
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://github.com/elisonmartins"
              alt="QR Code Pix"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
        )}

        {/* boleto */}
        {form.paymentMethod === "Boleto" && (
          <div className="border rounded-xl p-6 space-y-4">
            <p className="font-semibold">Boleto Bancário</p>
            <div className="bg-gray-100 p-4 rounded-lg text-sm font-mono">
              34191.79001 01043.510047 91020.150008 8 90070000010000
            </div>
          </div>
        )}

        {/* cartao */}
        {form.paymentMethod === "Cartão" && (
          <div className="border rounded-xl p-6 space-y-6 flex flex-col items-center">
            <CreditCard
              number={cardData.number}
              name={cardData.name}
              expiry={cardData.expiry}
              cvv={cardData.cvv}
              isFlipped={isFlipped}
            />

            <input
              placeholder="Número do cartão"
              className="input"
              value={cardData.number}
              onChange={(e) =>
                setCardData({
                  ...cardData,
                  number: formatCardNumber(e.target.value),
                })
              }
            />

            <input
              placeholder="Nome no cartão"
              className="input"
              value={cardData.name}
              onChange={(e) =>
                setCardData({ ...cardData, name: e.target.value })
              }
            />

            <div className="grid grid-cols-2 gap-4 w-full">
              <input
                placeholder="Validade (MM/AA)"
                className="input"
                value={cardData.expiry}
                onChange={(e) =>
                  setCardData({
                    ...cardData,
                    expiry: formatExpiry(e.target.value),
                  })
                }
              />

              <input
                placeholder="CVV"
                className="input"
                value={cardData.cvv}
                onFocus={() => setIsFlipped(true)}
                onBlur={() => setIsFlipped(false)}
                onChange={(e) =>
                  setCardData({
                    ...cardData,
                    cvv: formatCVV(e.target.value),
                  })
                }
              />
            </div>
          </div>
        )}

        <button
          onClick={handleSubmitWithValidation}
          disabled={submitting}
          className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition cursor-pointer"
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
