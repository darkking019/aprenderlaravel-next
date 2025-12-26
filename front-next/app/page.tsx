"use client";

import Link from "next/link";
import Button from "@/app/components/ui/button/Button";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <section className="w-full max-w-2xl bg-white shadow-md rounded-lg p-10 text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Bem-vindo 👋
        </h1>

        <p className="text-gray-600 text-lg">
          Você está logado com sucesso. A partir daqui você pode acessar
          seu painel, gerenciar dados e usar o sistema normalmente.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Link href="/dashboard">
            <Button className="px-8 py-3">
              Ir para o Dashboard
            </Button>
          </Link>

          <Link href="/profile">
            <Button className="px-8 py-3">
              Meu Perfil
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
