'use client';

import { useState } from 'react';
import Input from 'app/components/ui/input';
import Button from 'app/components/ui/Button';
export default function TwoFactorChallengePage() {
  const [isRecovery, setIsRecovery] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Logo (opcional - você pode colocar sua logo aqui) */}
        <div className="flex justify-center">
          <div className="bg-indigo-600 rounded-full w-20 h-20 flex items-center justify-center text-white text-3xl font-bold">
            EA
          </div>
        </div>

        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Autenticação em duas etapas
          </h2>

          {/* Mensagem principal */}
          <p className={`mt-4 text-center text-sm text-gray-600 dark:text-gray-400 ${isRecovery ? 'hidden' : ''}`}>
            Confirme o acesso à sua conta inserindo o código de autenticação fornecido pelo seu aplicativo autenticador.
          </p>

          <p className={`mt-4 text-center text-sm text-gray-600 dark:text-gray-400 ${isRecovery ? '' : 'hidden'}`}>
            Confirme o acesso à sua conta inserindo um dos seus códigos de recuperação de emergência.
          </p>
        </div>

        {/* Aqui você pode adicionar mensagens de erro no futuro */}

        <form className="mt-8 space-y-6" action="/api/auth/2fa" method="POST">
          {/* Campo: Código do autenticador */}
          <div className={isRecovery ? 'hidden' : ''}>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Código do autenticador
            </label>
            <Input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus={!isRecovery}
              placeholder="123456"
              className="text-center text-2xl tracking-widest"
            />
          </div>

          {/* Campo: Código de recuperação */}
          <div className={isRecovery ? '' : 'hidden'}>
            <label htmlFor="recovery_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Código de recuperação
            </label>
            <Input
              id="recovery_code"
              name="recovery_code"
              type="text"
              autoComplete="one-time-code"
              autoFocus={isRecovery}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              className="font-mono"
            />
          </div>

          {/* Botões de alternância + Login */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            {/* Link para alternar modo */}
            <button
              type="button"
              onClick={() => setIsRecovery(!isRecovery)}
              className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 underline underline-offset-4 transition"
            >
              {isRecovery ? 'Usar código do autenticador' : 'Usar código de recuperação'}
            </button>

            <Button variant="primary" type="submit" className="w-full sm:w-auto px-8 py-3 text-base">
              Entrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}