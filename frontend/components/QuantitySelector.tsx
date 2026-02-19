"use client";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
}: Props) {
  const handleChange = (rawValue: string) => {
    if (rawValue === "") {
      onChange(min);
      return;
    }

    if (rawValue.length > 2) return;

    const numeric = Number(rawValue);

    if (isNaN(numeric)) return;

    if (numeric < min) {
      onChange(min);
    } else if (numeric > max) {
      onChange(max);
    } else {
      onChange(numeric);
    }
  };

  const decrement = () => {
    if (value > min) onChange(value - 1);
  };

  const increment = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="flex items-center justify-center md:justify-start">
      <button
        type="button"
        onClick={decrement}
        className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-l-lg px-3 h-11 flex items-center justify-center"
      >
        −
      </button>

      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="w-16 h-11 text-center border-y border-gray-300 focus:outline-none"
      />

      <button
        type="button"
        onClick={increment}
        className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-r-lg px-3 h-11 flex items-center justify-center"
      >
        +
      </button>
    </div>
  );
}
