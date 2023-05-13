import Navbar from './components/navbar/navbar';
import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from './components/theme-provider';
import { UserProvider } from './appwrite/useUser';
import { Toaster } from '@/app/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'The Trading Dashboard.',
  description: 'Your go to for statistics and analytics on your trading.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <main className="mx-auto px-4 sm:px-6 lg:px-8">
              <Navbar />
              {children}
              <Toaster />
            </main>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}
