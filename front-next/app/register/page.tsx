"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Input from "@/app/components/ui/Input/input";
import Button from "@/app/components/ui/button/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1️⃣ CSRF (Sanctum)
      const csrfRes = await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        credentials: "include",
      });

      if (!csrfRes.ok) throw new Error("Falha ao obter CSRF");

      // 2️⃣ Form
      const formData = new FormData(e.currentTarget);

      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const password = String(formData.get("password") || "");
      const password_confirmation = String(formData.get("password_confirmation") || "");

      if (!name || !email || !password || !password_confirmation)
        throw new Error("Preencha todos os campos");

      if (password !== password_confirmation)
        throw new Error("As senhas não coincidem");

      // 3️⃣ Register (Laravel já autentica aqui)
      const registerRes = await fetch(`${API_URL}/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ name, email, password, password_confirmation }),
      });

      if (!registerRes.ok) {
        const data = await registerRes.json().catch(() => ({}));
        throw new Error(
          data.message ||
          data.errors?.email?.[0] ||
          data.errors?.password?.[0] ||
          "Erro ao registrar"
        );
      }

      // 4️⃣ Confirma sessão
      const meRes = await fetch(`${API_URL}/api/user`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!meRes.ok) throw new Error("Usuário não autenticado após registro");

      // 5️⃣ Sucesso
      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao registrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <section className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Criar conta</h1>
          <p className="mt-2 text-sm text-gray-600">
            Ou{" "}
            <Link
              href="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              entre na sua conta
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              name="name"
              type="text"
              placeholder="Seu nome"
              required
              autoComplete="name"
              className="w-full"
            />
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
              autoComplete="new-password"
              className="w-full"
            />
            <Input
              name="password_confirmation"
              type="password"
              placeholder="Confirme a senha"
              required
              autoComplete="new-password"
              className="w-full"
            />
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800 text-center">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4"
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </Button>
        </form>
      </section>
    </main>
  );
}
