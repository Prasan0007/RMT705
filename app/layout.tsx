import type { Metadata, Viewport } from "next";
import { Unbounded, Inter } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { AppShell } from "@/components/layout/AppShell";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FOILFALL — Every rip is real.",
  description:
    "Buy tokens, rip digital packs, pull real graded cards. Vault them, ship them, or sell back for tokens.",
};

export const viewport: Viewport = {
  themeColor: "#08090b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${unbounded.variable} ${inter.variable} h-full`}>
      <body className="min-h-full antialiased">
        <AppShell>
          <NavBar />
          <main>{children}</main>
          <Footer />
        </AppShell>
      </body>
    </html>
  );
}
