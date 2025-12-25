import Button from 'app/components/ui/button';
import Link from 'next/link';

export default function VerifyEmailPage() {
  // Simula se o link foi reenviado (no futuro você pega isso de query param ou estado)
  const linkSent = false; // Mude para true pra testar a mensagem de sucesso

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        {/* Ícone ou ilustração (opcional) */}
        <div className="flex justify-center">
          <div className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-24 h-24 flex items-center justify-center">
            <svg className="w-12 h-12 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Verifique seu email
          </h2>

          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Obrigado por se cadastrar! Antes de começar, por favor verifique seu endereço de email clicando no link que acabamos de enviar para você.
            <br /><br />
            Se você não recebeu o email, podemos enviar outro com prazer.
          </p>

          {/* Mensagem de sucesso ao reenviar */}
          {linkSent && (
            <div className="mt-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-700 rounded-lg">
              <p className="text-sm font-medium text-green-800 dark:text-green-400">
                Um novo link de verificação foi enviado para o seu email.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Botão Reenviar */}
          <form action="/api/auth/resend-verification" method="POST" className="w-full sm:w-auto">
            <Button variant="primary" type="submit" className="w-full sm:w-auto px-8 py-3 text-base">
              Reenviar email de verificação
            </Button>
          </form>

          {/* Botão Logout */}
          <form action="/api/auth/logout" method="POST" className="w-full sm:w-auto">
            <button
              type="submit"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 underline underline-offset-4 transition"
            >
              Sair da conta
            </button>
          </form>
        </div>

        {/* Link opcional pra suporte */}
        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-500">
          Problemas com o email? Entre em contato com o suporte.
        </p>
      </div>
    </div>
  );
}