import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { Providers } from '@/components/providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Chiro — The All-in-One Discord Bot',
  description: 'Modern, dark Discord-inspired dashboard for your server.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0f0f17] text-white min-h-screen`}>
        <Providers>
          {children}
        </Providers>
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
