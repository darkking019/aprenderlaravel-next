"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "app/components/ui/input";
import Button from "app/components/ui/Button";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      // 1️⃣ CSRF Sanctum
      await fetch(`${API_URL}/sanctum/csrf-cookie`, {
        credentials: "include",
      });

      // 2️⃣ Register
      const res = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Erro ao criar conta");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-4xl font-bold text-center">Crie sua conta</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input name="name" placeholder="Nome completo" required />
          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Senha" required />
          <Input
            name="password_confirmation"
            type="password"
            placeholder="Confirmar senha"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button disabled={loading} type="submit">
            {loading ? "Criando..." : "Criar conta"}
          </Button>

          <Link href="/login">Já tem conta? Faça login</Link>
        </form>
      </div>
    </div>
  );
}
