// app/login/page.tsx  (ou o caminho que você usa para a página de login)

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth} from 'app/context/AuthContext'

import Input from "app/components/ui/input";       // ajuste o caminho se necessário
import Button from "app/components/ui/button";     // ajuste o caminho se necessário

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth(); // Pega a função login do contexto
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const email = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "").trim();

      if (!email || !password) {
        throw new Error("Preencha email e senha");
      }

      // Faz o login no backend
      const loginRes = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!loginRes.ok) {
        const data = await loginRes.json().catch(() => ({}));
        throw new Error(
          data.message ||
            data.errors?.email?.[0] ||
            "Email ou senha inválidos"
        );
      }

      const { token, user } = await loginRes.json();

      // Salva no contexto (e automaticamente no localStorage)
      login(token, user);

      // Redireciona para o dashboard
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Erro no login:", err);
      setError(err.message || "Erro ao fazer login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <section className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Entrar na conta</h1>
          <p className="mt-2 text-sm text-gray-600">
            Ou{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500 transition"
            >
              crie uma conta nova
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              autoComplete="email"
              className="w-full"
            />

            <Input
              name="password"
              type="password"
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200">
              <p className="text-sm text-red-800 text-center">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition"
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </section>
    </main>
  );
}