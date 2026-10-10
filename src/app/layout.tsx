import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/layout";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Equilíbrio | Saúde, Tecnologia e Bem-Estar",
  description: "Seu espaço para informação, organização e bem-estar. Plataforma interativa para acompanhar hábitos, organizar momentos de foco e aprender sobre bem-estar.",
  openGraph: {
    title: "Equilíbrio | Saúde, Tecnologia e Bem-Estar",
    description: "Seu espaço para informação, organização e bem-estar.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
