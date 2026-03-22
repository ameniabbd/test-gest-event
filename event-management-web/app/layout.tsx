import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventAdmin - Gestion d'événements",
  description: "Plateforme de gestion d'événements",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>  {/* ⚠️ Assurez-vous que AuthProvider est bien ici */}
          {children}
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}