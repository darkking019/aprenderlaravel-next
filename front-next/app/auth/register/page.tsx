import Input from '@/app/components/ui/input';
import Button from '@/app/components/ui/Button';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Crie sua conta
          </h2>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Preencha os dados abaixo para começar
          </p>
        </div>

        <form className="mt-8 space-y-6" action="/api/auth/register" method="POST">
          {/* No futuro: trocar por Server Action com Supabase */}

          {/* Nome */}
          <div className="space-y-1">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome completo
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              autoFocus
              placeholder="João da Silva"
              className="text-base"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="joao@exemplo.com"
              className="text-base"
            />
          </div>

          {/* Senha */}
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Senha
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Mínimo 8 caracteres"
              className="text-base"
            />
          </div>

          {/* Confirmar senha */}
          <div className="space-y-1">
            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Confirmar senha
            </label>
            <Input
              id="password_confirmation"
              name="password_confirmation"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Digite novamente"
              className="text-base"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <Link
              href="/login"
              className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium underline-offset-4 hover:underline transition"
            >
              Já tem conta? Faça login
            </Link>

            <Button variant="primary" type="submit" className="w-full sm:w-auto px-8 py-3 text-base">
              Criar conta
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}