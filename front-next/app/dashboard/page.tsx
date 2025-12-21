"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        // 👤 usuário autenticado
        const userRes = await fetch("/api/user", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!userRes.ok) throw new Error("401");

        const userData = await userRes.json();
        setUser(userData);

        // 📅 eventos do dashboard
        const eventsRes = await fetch("/api/events", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!eventsRes.ok) throw new Error("Erro ao carregar eventos");

        const eventsJson = await eventsRes.json();
        setEvents(eventsJson.data ?? []); // 👈 importante
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [router]);

  async function logout() {
    await fetch("/sanctum/csrf-cookie", {
      credentials: "include",
    });

    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    router.push("/login");
  }

  if (loading) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10">Usuário não autenticado</p>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between mb-8">
        <h1 className="text-4xl font-bold">Meus eventos</h1>
        <button
          onClick={logout}
          className="px-6 py-3 bg-red-600 text-white rounded-lg"
        >
          Sair
        </button>
      </div>

      <p className="mb-6">
        Bem-vindo, <strong>{user.name}</strong>
      </p>

      {events.length ? (
        <div className="grid gap-6 md:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="border p-4 rounded cursor-pointer hover:bg-gray-50"
              onClick={() => router.push(`/events/${event.id}`)}
            >
              <h3 className="font-bold">{event.title}</h3>
            </div>
          ))}
        </div>
      ) : (
        <p>Você não tem eventos ainda.</p>
      )}
    </div>
  );
}
