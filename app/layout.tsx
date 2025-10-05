import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Slide Generator',
  description: 'Generate PowerPoint presentations from lyrics and Bible verses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
