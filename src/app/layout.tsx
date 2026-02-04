import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Energy Efficiency C&I/B2G - Dimensionamento Interventi Energetici',
  description:
    'Piattaforma professionale per il dimensionamento preliminare di interventi integrati (FV, BESS, PdC, LED) nel settore Commerciale & Industriale e Pubblica Amministrazione',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="antialiased">{children}</body>
    </html>
  );
}
