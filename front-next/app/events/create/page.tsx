"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function CreateEventPage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [price, setPrice] = useState<number | null>(null);

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

  // ---------------------------
  // Auth
  // ---------------------------
  useEffect(() => {
  async function checkAuth() {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/user`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Erro ao buscar usuário");
      }

      const data = await res.json();
      setUser(data.data ?? data);
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  checkAuth();
}, [router]);

  // ---------------------------
  // Payment return
  // ---------------------------
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const payment = params.get("payment");

  if (!payment) return;

  if (payment === "failure") {
    alert("Pagamento falhou");
    return;
  }

  if (payment === "pending") {
    alert("Pagamento pendente");
    return;
  }

  if (payment === "success") {
    const ref = localStorage.getItem("payment_ref");
    const token = localStorage.getItem("token"); // pega token do usuário

    if (!ref) {
      alert("Referência de pagamento perdida");
      return;
    }

    if (!token) {
      alert("Usuário não autenticado");
      router.push("/login");
      return;
    }

    fetch(`${API_URL}/api/payments/confirm?ref=${ref}`, {
      method: "GET", // ou POST, depende da sua rota
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`, // Bearer token
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao confirmar pagamento");
        return res.json();
      })
      .then(() => {
        localStorage.removeItem("payment_ref");
        router.push("/events");
      })
      .catch(() => {
        alert("Pagamento aprovado, mas erro ao confirmar.");
      });
  }
}, [router]);


  // ---------------------------
  // Handlers
  // ---------------------------
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
    if (e.target.files?.[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const addItem = () => {
    if (newItem.trim()) {
      setFormData((prev) => ({
        ...prev,
        items: [...prev.items, newItem.trim()],
      }));
      setNewItem("");
    }
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

  // ---------------------------
  // Submit
  // ---------------------------
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!validateForm()) return;

  setSubmitting(true);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Usuário não autenticado");
      router.push("/login");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("description", formData.description);
    payload.append("date", formData.date);
    payload.append("city", formData.city);
    payload.append("private", formData.is_public ? "0" : "1");
    payload.append("items", JSON.stringify(formData.items));

    if (formData.image) {
      payload.append("image", formData.image);
    }

    console.log("API URL:", `${API_URL}/api/events/create-payment`);

    const res = await fetch(`${API_URL}/api/events/create-payment`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`, // Bearer token
      },
      body: payload,
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Erro backend:", text);
      alert("Erro ao criar pagamento.");
      return;
    }

    const data = await res.json();
    setPrice(data.price);

    window.location.href = data.init_point;
  } catch (err) {
    console.error("FETCH ERROR:", err);
    alert("Erro de conexão.");
  } finally {
    setSubmitting(false);
  }
};

  // ---------------------------
  // JSX
  // ---------------------------
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Criar novo evento</h1>

      <p className="mb-6">
        Olá, <strong>{user?.name || "Usuário"}</strong>!
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label className="block mb-1">Título do evento</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.title && (
            <p className="text-red-600 text-sm">{errors.title}</p>
          )}
        </div>

        {/* Cidade */}
        <div>
          <label className="block mb-1">Cidade</label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.city && (
            <p className="text-red-600 text-sm">{errors.city}</p>
          )}
        </div>

        {/* Descrição */}
        <div>
          <label className="block mb-1">Descrição</label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.description && (
            <p className="text-red-600 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Data */}
        <div>
          <label className="block mb-1">Data</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.date && (
            <p className="text-red-600 text-sm">{errors.date}</p>
          )}
        </div>

        {/* Imagem */}
        <div>
          <label className="block mb-1">Imagem (opcional)</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* Público */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_public"
            checked={formData.is_public}
            onChange={handleChange}
          />
          Evento público?
        </label>

        {/* Itens */}
        <div>
          <label className="block mb-1">Itens opcionais</label>
          <div className="flex gap-2">
            <input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addItem())
              }
              className="flex-1 border px-3 py-2 rounded"
            />
            <button type="button" onClick={addItem}>
              Adicionar
            </button>
          </div>
        </div>

        {/* Ações */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Pagar R${" "}
            {price != null && !isNaN(price)
              ? price.toFixed(2).replace(".", ",")
              : "--"}{" "}
            e criar
          </button>
        </div>
      </form>
    </div>
  );
}
