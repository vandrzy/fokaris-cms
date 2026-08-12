import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fokaris CMS',
  description: 'Next-generation headless CMS with a beautiful, dynamic interface.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
