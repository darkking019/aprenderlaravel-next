// app/auth/confirm-password/page.tsx
'use client'
import Button from '@/app/components/ui/button/Button';

import Input from '@/app/components/ui/Input/input';

export default function ConfirmPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Confirme sua senha
        </h1>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-8">
          Insira sua senha para confirmar a ação.
        </p>

        <form className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Senha
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <div className="flex justify-end mt-6">
            <Button variant="primary" type="submit">
              Confirmar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}