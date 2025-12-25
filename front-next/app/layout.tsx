import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from 'app/context/AuthContext';
import Navbar from '@/app/components/navbar/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'HDC Events',
  description: 'Gerencie e participe de eventos incríveis',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen flex flex-col`}>
        <AuthProvider>
          <Navbar /> {/* Client component */}

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {children}
          </main>

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
