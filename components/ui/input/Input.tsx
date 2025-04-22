"use client";

import { forwardRef, useState } from "react";
import { InputProps } from "./type";
import { Eye, EyeOff } from "lucide-react"; // یا هر آیکون دیگه‌ای که استفاده می‌کنی

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="flex flex-col w-full">
        {label && <label className="mb-1 text-sm font-medium">{label}</label>}
        <div className="relative">
          <input
            ref={ref}
            type={isPassword && showPassword ? "text" : type}
            className={`w-full px-3 py-2 border rounded-lg outline-none transition-all  ${className} ${
              error
                ? "border-red-500 focus:ring focus:ring-red-300"
                : "border-gray-300 focus:ring focus:ring-primary"
            }`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
