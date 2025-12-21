"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PublicEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/public/events");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setEvents(data.data || data || []);
      } catch {
        alert("Erro ao carregar eventos públicos");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="text-center mt-10">Carregando...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Todos os Eventos Públicos</h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum evento público disponível.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event: any) => (
            <Link key={event.id} href={`/events/${event.id}`} className="block">
              <div className="border rounded-lg p-6 bg-white hover:shadow-lg transition">
                <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-4">{event.description || "Sem descrição"}</p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>Data: {new Date(event.date).toLocaleDateString("pt-BR")}</p>
                  <p>Cidade: {event.city}</p>
                  <p>Organizador: {event.user?.name || "Anônimo"}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}