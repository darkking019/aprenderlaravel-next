// app/me/page.tsx

import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

async function getUser() {
  const res = await fetch(`${API_URL}/api/user`, {
    credentials: "include", // essencial pro Sanctum
    headers: {
      Accept: "application/json",
    },
    cache: "no-store", // 👈 MUITO IMPORTANTE em Server Component
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

export default async function MePage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Você está logado!</h1>

      <pre className="bg-gray-100 p-4 rounded mb-4">
        {JSON.stringify(user, null, 2)}
      </pre>

      <p>Nome: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
}
