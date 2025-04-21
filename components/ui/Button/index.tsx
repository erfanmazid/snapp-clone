"use client";

import { ButtonProps } from "./type";

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  loading = false,
  disabled = false,
  className = "",
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${className} w-full px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md`}
    >
      {loading ? (
        <span className="relative flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>لطفاً صبر کنید...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
