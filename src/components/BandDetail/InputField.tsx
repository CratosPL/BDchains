"use client";

import { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
  placeholder?: string;
  type?: string;
}

export const InputField = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  ...props
}: InputFieldProps) => (
  <div className="space-y-1">
    <label className="text-[#8a8a8a]">
      <strong>{label}:</strong>
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 bg-[#2a2a2a] text-[#b0b0b0] border border-[#3a1c1c] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8a4a4a]"
      {...props}
    />
    {error && <p className="text-[#8a4a4a] text-sm">{error}</p>}
  </div>
);