import type { Metadata } from "next";
import Link from "next/link";

import { adaptadorConfigurado } from "@/lib/db";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Beatmatch — DJs y productoras de eventos",
    template: "%s · Beatmatch",
  },
  description:
    "El punto de encuentro entre DJs y quienes arman los eventos. Buscá por estilo, ciudad y presupuesto, escuchá sets y contactá directo.",
  openGraph: {
    type: "website",
    siteName: "Beatmatch",
    locale: "es_AR",
  },
};

function Marca() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0">
      <svg width="28" height="28" viewBox="0 0 34 34" fill="none" aria-hidden="true">
        <circle cx="8" cy="17" r="6.5" stroke="#FF5B26" strokeWidth="2.4" />
        <circle cx="26" cy="17" r="6.5" stroke="#C8FF4D" strokeWidth="2.4" />
        <line
          x1="4" y1="17" x2="30" y2="17"
          stroke="#F3F1E9" strokeWidth="1.5" strokeDasharray="1 3.4"
        />
        <circle cx="17" cy="17" r="3" fill="#F3F1E9" />
      </svg>
      <span className="font-mono text-[14px] font-bold tracking-[0.06em] uppercase">
        BEAT<span className="text-signal">MATCH</span>
      </span>
    </Link>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const modoArchivo = adaptadorConfigurado() === "file";

  return (
    <html lang="es-AR">
      <body>
        {modoArchivo && (
          <div className="bg-signal text-ink font-mono text-[11px] tracking-[0.06em] px-4 py-2 text-center">
            MODO LOCAL — los datos se guardan en{" "}
            <code className="font-bold">data/beatmatch.json</code>. Configurá
            Supabase antes de publicar.
          </div>
        )}

        <header className="border-b border-linea sticky top-0 z-50 bg-ink/95 backdrop-blur">
          <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between gap-4">
            <Marca />
            <nav className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/djs"
                className="font-mono text-[11.5px] tracking-[0.08em] uppercase text-steel hover:text-texto transition-colors"
              >
                Buscar DJs
              </Link>
              <Link href="/registro" className="btn btn-primario !px-4 !py-2.5 !text-[11.5px]">
                Sumar mi perfil
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-5">{children}</main>

        <footer className="border-t border-linea mt-24">
          <div className="max-w-6xl mx-auto px-5 py-8 flex flex-wrap gap-3 justify-between items-center">
            <p className="etiqueta">Beatmatch — la industria en sync</p>
            <div className="flex gap-5">
              <Link href="/djs" className="etiqueta hover:text-texto transition-colors">
                Buscar
              </Link>
              <Link href="/registro" className="etiqueta hover:text-texto transition-colors">
                Sumarme
              </Link>
              <Link href="/admin" className="etiqueta hover:text-texto transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
