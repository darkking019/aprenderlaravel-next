"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [user, setUser] = useState<any>(null);
  const [event, setEvent] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const userRes = await fetch("/api/user", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (!userRes.ok) throw new Error("Não autenticado");
        const userData = await userRes.json();
        setUser(userData.data);

        const eventRes = await fetch(`/api/events/event/${eventId}`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (!eventRes.ok) throw new Error("Evento não encontrado");
        const eventData = await eventRes.json();

        // Força items como array
        const eventWithItems = {
          ...eventData.data,
          items: Array.isArray(eventData.data.items) ? eventData.data.items : [],
        };
        setEvent(eventWithItems);

        const participantsRes = await fetch(`/api/events/event/${eventId}/participants`, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });
        if (participantsRes.ok) {
          const participantsData = await participantsRes.json();
          setParticipants(participantsData.data || []);
        }
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    if (eventId) load();
  }, [eventId, router]);

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este evento?")) return;

    try {
      await fetch("/sanctum/csrf-cookie", { credentials: "include" });

      const res = await fetch(`/api/events/event/${eventId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (res.ok) router.push("/dashboard");
      else alert("Erro ao excluir evento.");
    } catch (err) {
      console.error(err);
      alert("Erro de conexão.");
    }
  }

  if (loading) return <p className="text-center mt-10">Carregando...</p>;
  if (!event) return <p className="text-center mt-10">Evento não encontrado.</p>;

  const isOwner = user?.id === event.user_id;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold">{event.title}</h1>
          <p className="mt-2 text-lg text-gray-600">
            Evento {event.private ? "privado" : "público"}
          </p>
        </div>

        {isOwner && (
          <div className="flex gap-4">
            <button
              onClick={() => router.push(`/events/${eventId}/edit`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Excluir
            </button>
          </div>
        )}
      </div>

      <div className="border rounded-lg p-6 mb-8 bg-gray-50 space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-500">Descrição</p>
          <p className="text-lg">{event.description || "Sem descrição"}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-gray-500">Data</p>
            <p className="text-lg">{new Date(event.date).toLocaleDateString("pt-BR")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Cidade</p>
            <p className="text-lg">{event.city}</p>
          </div>
        </div>

        {event.items.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Itens sugeridos</p>
            <ul className="list-disc list-inside">
              {event.items.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="border rounded-lg p-6 bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Participantes ({participants.length})</h2>
        {participants.length ? (
          <ul className="space-y-2">
            {participants.map((p: any, i: number) => (
              <li key={p.id}>
                {i + 1}. {p.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Nenhum participante ainda.</p>
        )}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          ← Voltar
        </button>
      </div>
    </div>
  );
}