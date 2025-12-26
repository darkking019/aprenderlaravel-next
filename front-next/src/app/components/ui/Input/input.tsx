// components/ui/Input.tsx
import { InputHTMLAttributes, forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        {...props}
        className={`
          appearance-none
          relative
          block
          w-full
          px-3
          py-2
          border
          border-gray-300
          dark:border-gray-700
          placeholder-gray-500
          text-gray-900
          dark:text-white
          rounded-md
          focus:outline-none
          focus:ring-2
          focus:ring-indigo-500
          focus:border-indigo-500
          focus:z-10
          sm:text-sm
          dark:bg-gray-800
          transition
          ${className ?? ""}
        `}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
