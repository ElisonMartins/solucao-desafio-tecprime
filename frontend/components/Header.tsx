"use client";

import { FaUser } from "react-icons/fa";

export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-semibold tracking-tight">
          SellerList
        </h1>

        <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-100 transition">
          <FaUser className="text-sm" />
          <span className="text-sm font-medium">Sign up</span>
        </button>
      </div>
    </header>
  );
}
