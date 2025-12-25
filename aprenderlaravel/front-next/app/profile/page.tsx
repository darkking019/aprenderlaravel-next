"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
  created_at?: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/user", {
          credentials: "include",
        });

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Erro ao carregar usuário");
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError("Não foi possível carregar seu perfil.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-10">Carregando perfil...</p>;
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg">
        <h1 className="text-xl font-bold text-red-600">Erro</h1>
        <p className="mt-2">{error}</p>

        <button
          onClick={() => router.refresh()}
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Meu perfil</h1>

      <div className="space-y-4 border rounded-lg p-6">
        <div>
          <p className="text-sm text-gray-500">Nome</p>
          <p className="text-lg font-medium">{user.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="text-lg font-medium">{user.email}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Conta criada em</p>
          <p className="text-lg font-medium">
            {user.created_at
              ? new Date(user.created_at).toLocaleDateString()
              : "-"}
          </p>
        </div>

        <div className="pt-4 flex gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg"
          >
            Voltar
          </button>

          <button
            onClick={() => alert("editar depois")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Editar perfil
          </button>
        </div>
      </div>
    </div>
  );
}
