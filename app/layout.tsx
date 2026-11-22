import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Cacto | كاكتو - Handmade Pottery & Unique Jewellery",
  description: "Artisanal ceramic mugs and gold-plated jewellery by Cacto Club.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <StoreProvider>
          <Navbar />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}