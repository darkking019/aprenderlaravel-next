import Input from '@/app/components/ui/Input/input';
import Button from '@/app/components/ui/button/Button';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Esqueceu sua senha?
          </h2>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400 max-w">
            Sem problemas. Informe seu endereço de email que enviaremos um link para você criar uma nova senha.
          </p>
        </div>

        {/* Aqui você pode mostrar mensagem de sucesso depois (ex: "Link enviado!") */}
        {/* <div className="text-center text-sm text-green-600 dark:text-green-400">Link enviado com sucesso!</div> */}

        <form className="mt-8 space-y-6" action="/api/auth/forgot-password" method="POST">
          {/* No futuro: trocar por Server Action com Supabase ou Resend para enviar email */}

          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              autoFocus
              placeholder="seu@email.com"
            />
            {/* Mensagem de erro (ex: email não encontrado) - você pode adicionar com estado depois */}
            {/* <p className="text-sm text-red-600 dark:text-red-400">Email não encontrado</p> */}
          </div>

          <div className="flex items-center justify-end">
            <Button variant="primary" type="submit">
              Enviar link de recuperação
            </Button>
          </div>

          <div className="text-center">
            <Link href="/login" className="text-sm text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              ← Voltar para login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}