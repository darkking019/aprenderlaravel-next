// app/layout.tsx

import './globals.css';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { AuthProvider, useAuth} from 'app/context/AuthContext'


const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'HDC Events',
  description: 'Gerencie e participe de eventos incríveis',
};

// Componente interno da Navbar (precisa estar dentro do Provider para usar useAuth)
function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    // Chama o endpoint de logout no backend (revoga o token)
    const API_URL = process.env.NEXT_PUBLIC_API_URL!;
    await fetch(`${API_URL}/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    // Remove tudo do localStorage e atualiza o contexto
    logout();
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/img/icone.jpg"
              alt="HDC Events"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              HDC Events
            </span>
          </Link>

          {/* Menu principal */}
          <ul className="hidden md:flex items-center space-x-8">
            <li>
              <Link href="/events/event" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Eventos
              </Link>
            </li>
            <li>
              <Link href="/events/create" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Criar evento
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Contatos
              </Link>
            </li>
          </ul>

          {/* Autenticação */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link href="/dashboard" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Meus eventos
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition font-medium"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition font-medium"
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

// Layout principal
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar /> {/* Navbar com autenticação */}

          {/* Conteúdo principal */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-800 text-white py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p>HDC Events &copy; 2025 - Todos os direitos reservados</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}