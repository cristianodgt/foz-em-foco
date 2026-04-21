"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X, Megaphone } from "lucide-react";

const EDITORIAS_NAV = [
  { label: "Cidade", slug: "cidade" },
  { label: "Política", slug: "politica" },
  { label: "Economia", slug: "economia" },
  { label: "Turismo", slug: "turismo" },
  { label: "Paraguai", slug: "paraguai" },
  { label: "Cultura", slug: "cultura" },
  { label: "Esporte", slug: "esporte" },
  { label: "Itaipu", slug: "itaipu" },
];

interface UtilityData {
  temp?: string;
  weather?: string;
  usd?: string;
  guarani?: string;
  bridge?: string;
}

interface HeaderProps {
  utility?: UtilityData;
}

export default function Header({ utility }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      {/* Utility strip */}
      <div className="bg-ink text-white text-xs font-mono py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center gap-4 overflow-x-auto scrollbar-none">
          {utility?.temp && (
            <span className="shrink-0">☀️ {utility.temp}°C {utility.weather}</span>
          )}
          {utility?.usd && (
            <span className="shrink-0">💵 USD {utility.usd}</span>
          )}
          {utility?.guarani && (
            <span className="shrink-0">🇵🇾 R$ 1 = ₲{utility.guarani}</span>
          )}
          {utility?.bridge && (
            <span className="shrink-0">🌉 Ponte {utility.bridge}</span>
          )}
          {!utility?.temp && (
            <>
              <span className="shrink-0 text-white/50">Carregando dados da cidade...</span>
            </>
          )}
          <span className="ml-auto shrink-0 text-white/40">
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
          </span>
        </div>
      </div>

      {/* Logo + actions */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-full bg-teal flex items-center justify-center text-white font-bold text-sm">
            FF
          </div>
          <span className="font-serif text-xl font-bold text-ink leading-none hidden sm:block">
            Foz em Foco
          </span>
        </Link>

        <div className="flex-1" />

        {/* Search */}
        {searchOpen ? (
          <form
            className="flex items-center gap-2 flex-1 max-w-sm"
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                window.location.href = `/busca?q=${encodeURIComponent(searchQuery)}`;
              }
            }}
          >
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar notícias..."
              className="flex-1 text-sm border border-border rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal/30"
            />
            <button type="button" onClick={() => setSearchOpen(false)} className="text-muted hover:text-ink">
              <X size={18} />
            </button>
          </form>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="text-muted hover:text-teal transition-colors"
            aria-label="Buscar"
          >
            <Search size={20} />
          </button>
        )}

        <Link
          href="/anuncie"
          className="hidden sm:flex items-center gap-1.5 bg-teal text-white text-sm font-semibold px-3 py-1.5 rounded hover:bg-teal-dark transition-colors"
        >
          <Megaphone size={14} />
          Anuncie
        </Link>

        <button
          className="sm:hidden text-ink"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop: horizontal scroll */}
          <div className="hidden sm:flex overflow-x-auto scrollbar-none gap-0">
            {EDITORIAS_NAV.map((e) => (
              <Link
                key={e.slug}
                href={`/categoria/${e.slug}`}
                className="shrink-0 px-4 py-2.5 text-sm font-medium text-ink-2 hover:text-teal hover:border-b-2 hover:border-teal transition-colors border-b-2 border-transparent"
              >
                {e.label}
              </Link>
            ))}
            <Link href="/guia" className="shrink-0 px-4 py-2.5 text-sm font-medium text-ink-2 hover:text-teal hover:border-b-2 hover:border-teal transition-colors border-b-2 border-transparent">
              Guia Comercial
            </Link>
            <Link href="/agenda" className="shrink-0 px-4 py-2.5 text-sm font-medium text-ink-2 hover:text-teal hover:border-b-2 hover:border-teal transition-colors border-b-2 border-transparent">
              Agenda
            </Link>
            <Link href="/empregos" className="shrink-0 px-4 py-2.5 text-sm font-medium text-ink-2 hover:text-teal hover:border-b-2 hover:border-teal transition-colors border-b-2 border-transparent">
              Empregos
            </Link>
          </div>

          {/* Mobile: dropdown */}
          {menuOpen && (
            <div className="sm:hidden pb-3 flex flex-col gap-1">
              {EDITORIAS_NAV.map((e) => (
                <Link
                  key={e.slug}
                  href={`/categoria/${e.slug}`}
                  className="px-3 py-2 text-sm font-medium text-ink-2 hover:text-teal hover:bg-teal-light rounded transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {e.label}
                </Link>
              ))}
              <Link href="/guia" className="px-3 py-2 text-sm font-medium text-ink-2 hover:text-teal hover:bg-teal-light rounded transition-colors" onClick={() => setMenuOpen(false)}>Guia Comercial</Link>
              <Link href="/agenda" className="px-3 py-2 text-sm font-medium text-ink-2 hover:text-teal hover:bg-teal-light rounded transition-colors" onClick={() => setMenuOpen(false)}>Agenda</Link>
              <Link href="/empregos" className="px-3 py-2 text-sm font-medium text-ink-2 hover:text-teal hover:bg-teal-light rounded transition-colors" onClick={() => setMenuOpen(false)}>Empregos</Link>
              <Link href="/anuncie" className="mt-2 px-3 py-2 text-sm font-semibold bg-teal text-white rounded text-center" onClick={() => setMenuOpen(false)}>Anuncie aqui</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
