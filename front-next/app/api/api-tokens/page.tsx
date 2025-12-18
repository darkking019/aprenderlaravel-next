import { createSupabaseServer } from '@/app/lib/supabase/server';
import { redirect } from 'next/navigation';
import Button from '@/app/components/ui/Button';
import Input from '@/app/components/ui/input';
import { useState } from 'react';

// Simulação de permissões (no futuro você puxa do banco ou define no backend)
const AVAILABLE_PERMISSIONS = [
  'read',
  'create',
  'update',
  'delete',
  'manage-users',
  'view-logs',
];

export default async function ApiTokensPage() {
  const supabase = await createSupabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Aqui você buscaria os tokens do usuário no Supabase
  // Exemplo simulado:
  const tokens = [
    { id: 1, name: 'Mobile App Token', last_used_at: '2025-12-10T10:00:00Z', permissions: ['read', 'create'] },
    { id: 2, name: 'Zapier Integration', last_used_at: null, permissions: ['read', 'update'] },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* Seção: Criar novo token */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Criar Token de API
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Tokens de API permitem que serviços externos autentiquem em nome do seu usuário.
        </p>

        <form action="/api/tokens/create" method="POST" className="space-y-6">
          {/* Nome do token */}
          <div className="max-w-lg">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome do token
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              autoFocus
              placeholder="Ex: App Mobile, Integração Zapier"
            />
          </div>

          {/* Permissões */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              Permissões
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {AVAILABLE_PERMISSIONS.map((permission) => (
                <label key={permission} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="permissions"
                    value={permission}
                    className="h-5 w-5 text-indigo-600 rounded border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-400 capitalize">
                    {permission.replace('-', ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <Button variant="primary" type="submit">
              Criar token
            </Button>
            {/* Mensagem de sucesso (exemplo simulado) */}
            <span className="ml-4 text-green-600 dark:text-green-400 text-sm font-medium">
              Criado com sucesso!
            </span>
          </div>
        </form>
      </div>

      {/* Seção: Tokens existentes */}
      {tokens.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Tokens existentes
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Você pode revogar qualquer token que não usa mais.
          </p>

          <div className="space-y-6">
            {tokens.map((token) => (
              <div
                key={token.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 bg-gray-50 dark:bg-gray-900 rounded-xl"
              >
                <div className="mb-4 sm:mb-0">
                  <p className="font-semibold text-gray-900 dark:text-white break-all">
                    {token.name}
                  </p>
                  {token.last_used_at ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Último uso: {new Date(token.last_used_at).toLocaleDateString('pt-BR')}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Nunca usado
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-6">
                  {/* Botão Permissões */}
                  <button className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 underline">
                    Permissões
                  </button>

                  {/* Botão Excluir */}
                  <button className="text-sm text-red-600 hover:text-red-800 dark:text-red-400 font-medium">
                    Revogar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}