"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditEventPage() {
  const router = useRouter();
  const { id: eventId } = useParams();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    city: "",
    is_public: true,
    image: null as File | null,
    items: [] as string[],
  });

  const [newItem, setNewItem] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function load() {
      try {
        const userRes = await fetch("/api/user", { credentials: "include" });
        if (!userRes.ok) throw new Error();

        const eventRes = await fetch(`/api/events/event/${eventId}`, {
          credentials: "include",
        });
        if (!eventRes.ok) throw new Error();

        const { data: evt } = await eventRes.json();

        setFormData({
          title: evt.title || "",
          description: evt.description || "",
          date: evt.date?.split("T")[0] || "",
          city: evt.city || "",
          is_public: !evt.private,
          image: null,
          items: Array.isArray(evt.items) ? evt.items : [],
        });
      } catch {
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    if (eventId) load();
  }, [eventId, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: checked !== undefined ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const addItem = () => {
    if (!newItem.trim()) return;
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem.trim()],
    }));
    setNewItem("");
  };

  const removeItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "O título é obrigatório";
    if (!formData.description.trim())
      newErrors.description = "A descrição é obrigatória";
    if (!formData.date) newErrors.date = "A data é obrigatória";
    if (!formData.city.trim()) newErrors.city = "A cidade é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);

    try {
      await fetch("/sanctum/csrf-cookie", { credentials: "include" });

      const payload = new FormData();
      payload.append("_method", "PUT"); // ⭐ ESSENCIAL
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("date", formData.date);
      payload.append("city", formData.city);
      payload.append("private", formData.is_public ? "0" : "1");
      payload.append("items", JSON.stringify(formData.items));

      if (formData.image) {
        payload.append("image", formData.image);
      }

      const res = await fetch(`/api/events/event/${eventId}`, {
        method: "POST", // ⭐ NUNCA PUT COM FORMDATA
        credentials: "include",
        body: payload,
      });

      if (res.ok) {
        alert("Evento atualizado com sucesso!");
        router.push(`/events/${eventId}`);
      } else {
        const data = await res.json().catch(() => ({}));
        if (data.errors) setErrors(data.errors);
        alert(data.message || "Erro ao atualizar evento");
      }
    } catch {
      alert("Erro de conexão");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Carregando...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold">Editar evento</h1>
          <p className="mt-2 text-lg text-gray-600">
            Atualize os detalhes abaixo
          </p>
        </div>
        <button
          onClick={() => router.push(`/events/${eventId}`)}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Título do evento
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Cidade</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.city && (
              <p className="text-red-600 text-sm mt-1">{errors.city}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descrição</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-2 border rounded-lg"
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1">
              {errors.description}
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Data</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.date && (
              <p className="text-red-600 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Imagem (opcional)
            </label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
        </div>

        <div>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
            />
            Evento público?
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Itens (opcional)
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addItem();
                }
              }}
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Adicionar
            </button>
          </div>

          {formData.items.map((item, i) => (
            <div key={i} className="flex justify-between mt-2">
              <span>{item}</span>
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-red-600"
              >
                Remover
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.push(`/events/${eventId}`)}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 bg-green-600 text-white rounded-lg"
          >
            {submitting ? "Salvando..." : "Salvar alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
