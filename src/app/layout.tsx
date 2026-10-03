import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import StoreShell from '@/components/StoreShell';

export const metadata: Metadata = {
  title: 'Karigar & Co. | Everyday Clothing, Footwear & Craft Chosen With Care',
  description:
    'Thoughtfully woven pre-shrunk long-staple cotton shirts, Kutch handloom kurtas, commuter chinos, Kolhapuri leather footwear, and heavyweight canvas totes from our Connaught Place, New Delhi studio.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <body className="antialiased min-h-screen flex flex-col bg-[#F8F5ED] text-[#18201B]">
        <StoreProvider>
          <StoreShell>{children}</StoreShell>
        </StoreProvider>
      </body>
    </html>
  );
}