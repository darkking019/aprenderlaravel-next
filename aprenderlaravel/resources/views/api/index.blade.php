// app/api-tokens/page.tsx
import { createSupabaseServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const AVAILABLE_PERMISSIONS = [
  'read-events',
  'create-events',
  'update-events',
  'delete-events',
  'manage-participants',
  'read-users',
];

export default async function ApiTokensPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Simulação de tokens existentes (no futuro: buscar do banco)
  const tokens = [
    {
      id: 1,
      name: 'App Mobile',
      last_used_at: '2025-12-15T14:30:00Z',
      permissions: ['read-events', 'create-events'],
    },
    {
      id: 2,
      name: 'Integração Zapier',
      last_used_at: null,
      permissions: ['read-events'],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header da página (equivalente ao <x-slot name="header">) */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 leading-tight">
          API Tokens
        </h2>
      </div>

      <div className="space-y-12">
        {/* ==================== CRIAR NOVO TOKEN ==================== */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
            Criar novo token de API
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-3xl">
            Tokens de API permitem que aplicativos ou serviços externos acessem sua conta de forma segura.
          </p>

          <form action="/api/tokens/create" method="POST" className="space-y-8 max-w-4xl">
            {/* Nome do token */}
            <div className="max-w-lg">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome do token
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                placeholder="Ex: App Mobile, Integração com Zapier"
                className="text-base"
              />
            </div>

            {/* Permissões */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                Permissões do token
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {AVAILABLE_PERMISSIONS.map((perm) => (
                  <label key={perm} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="permissions[]"
                      value={perm}
                      className="h-5 w-5 text-indigo-600 rounded border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300 capitalize">
                      {perm.replace('-', ' ').replace('events', 'eventos')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <Button variant="primary" type="submit" className="px-8 py-3 text-base">
                Criar token
              </Button>
            </div>
          </form>
        </section>

        {/* ==================== TOKENS EXISTENTES ==================== */}
        {tokens.length > 0 && (
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
              Tokens existentes
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Revogue tokens que você não utiliza mais.
            </p>

            <div className="space-y-6">
              {tokens.map((token) => (
                <div
                  key={token.id}
                  className="flex flex-col md:flex-row md:items-center md:justify-between p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
                >
                  <div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {token.name}
                    </p>
                    {token.last_used_at ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Último uso: {new Date(token.last_used_at).toLocaleString('pt-BR')}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 italic">
                        Nunca usado
                      </p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      Permissões: {token.permissions.join(', ')}
                    </p>
                  </div>

                  <div className="mt-6 md:mt-0 flex items-center space-x-8">
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">
                      Editar permissões
                    </button>
                    <button className="text-sm font-medium text-red-600 hover:text-red-800 dark:text-red-400">
                      Revogar token
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}