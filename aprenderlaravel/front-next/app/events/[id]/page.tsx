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
  fetch('https://events-platform-production-9928.up.railway.app/api/test')
    .then(res => res.json())
    .then(console.log)
    .catch(console.error)
}, [])


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

        // Força items como array e adiciona image_url (caso venha do backend)
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

  if (loading) return <p className="text-center mt-10 text-lg">Carregando evento...</p>;
  if (!event) return <p className="text-center mt-10 text-lg">Evento não encontrado.</p>;

  const isOwner = user?.id === event.user_id;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Banner com imagem do evento */}
      <div className="mb-10">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-2xl"
          />
        ) : (
          <div className="w-full h-64 md:h-96 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-gray-500 text-xl font-medium">Sem imagem de capa</span>
          </div>
        )}
      </div>

      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">{event.title}</h1>
          <p className="text-xl text-gray-600">
            {event.private ? "Evento privado" : "Evento público"}
          </p>
          <p className="text-gray-500 mt-1">
            {new Date(event.date).toLocaleString("pt-BR", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {isOwner && (
          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => router.push(`/events/${eventId}/edit`)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Editar evento
            </button>
            <button
              onClick={handleDelete}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Excluir
            </button>
          </div>
        )}
      </div>

      {/* Detalhes do evento */}
      <div className="border rounded-2xl p-8 mb-10 bg-white shadow-lg space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Descrição</p>
          <p className="text-lg mt-2 whitespace-pre-line">{event.description || "Sem descrição"}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Data e Hora</p>
            <p className="text-lg mt-2">
              {new Date(event.date).toLocaleDateString("pt-BR", { dateStyle: "long" })}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Cidade</p>
            <p className="text-lg mt-2">{event.city}</p>
          </div>
        </div>

        {event.items?.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Itens sugeridos</p>
            <ul className="list-disc list-inside text-lg space-y-1 pl-4">
              {event.items.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Participantes */}
      <div className="border rounded-2xl p-8 bg-white shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Participantes ({participants.length})</h2>
        {participants.length > 0 ? (
          <ul className="space-y-4">
            {participants.map((p: any, i: number) => (
              <li key={p.id} className="flex items-center gap-3">
                <span className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium">
                  {i + 1}
                </span>
                <span className="text-lg">{p.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Nenhum participante ainda. Seja o primeiro!</p>
        )}
      </div>

      {/* Botão voltar */}
      <div className="mt-12 text-center">
        <button
          onClick={() => router.push("/dashboard")}
          className="px-10 py-4 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-colors font-medium text-lg shadow-md"
        >
          ← Voltar para o dashboard
        </button>
      </div>
    </div>
  );
}