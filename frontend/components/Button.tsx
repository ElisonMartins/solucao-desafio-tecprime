import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  className?: string;
};

export default function Button({
  children,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        relative
        inline-flex
        items-center
        justify-center
        px-4 py-2
        text-sm
        tracking-wide
        border-2
        border-black
        text-black
        rounded-lg
        overflow-hidden
        transition-all
        duration-500
        hover:text-white
        active:scale-95
        cursor-pointer
        group
        ${className}
      `}
    >
      <span
        className="
          absolute
          inset-0
          bg-black
          translate-y-full
          group-hover:translate-y-0
          transition-transform
          duration-500
          ease-out
          z-0
        "
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
