"use client";

import styles from "./CreditCard.module.css";
import { CreditCardProps } from "@/types/credit-card";

export default function CreditCard({
  number,
  name,
  expiry,
  cvv,
  isFlipped,
}: CreditCardProps) {
  const formatNumber = (num: string) => {
    const cleaned = num.replace(/\D/g, "").slice(0, 16);
    return cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatName = (value: string) => {
    if (!value) return "NOME SOBRENOME";

    const upper = value.toUpperCase();

    return upper.length > 25 ? upper.slice(0, 23) + "..." : upper;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.flipCard}>
        <div
          className={styles.inner}
          style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0)" }}
        >
          {/* frente*/}
          <div className={styles.front}>
            <p className={styles.brand}>MASTERCARD</p>

            <div className={styles.chip}></div>

            <div className={styles.contactless}>)))</div>

            {/* logo */}
            <div className={styles.logo}>
              <span className={styles.red}></span>
              <span className={styles.orange}></span>
            </div>

            <p className={styles.number}>
              {formatNumber(number) || "0000 0000 0000 0000"}
            </p>

            <p className={styles.valid}>VALIDADE</p>

            <p className={styles.date}>{expiry || "MM/AA"}</p>

            <p className={styles.name}>{formatName(name)}</p>
          </div>

          {/* verso */}
          <div className={styles.back}>
            <div className={styles.strip}></div>
            <div className={styles.cvvBox}>{cvv || "***"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
