// components/ui/Button.tsx
import { ButtonHTMLAttributes } from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'danger' | 'secondary';
};

export default function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
  };

  return (
    <button
      className={`px-4 py-2 rounded-md font-medium transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}