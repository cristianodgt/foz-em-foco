"use client";
import Link from "next/link";

const navItems = [
  { href: "/categoria/cidade",   label: "Cidade" },
  { href: "/categoria/politica", label: "Política" },
  { href: "/categoria/economia", label: "Economia" },
  { href: "/categoria/turismo",  label: "Turismo" },
  { href: "/categoria/paraguai", label: "Paraguai" },
  { href: "/categoria/cultura",  label: "Cultura" },
  { href: "/guia",               label: "Guia" },
  { href: "/agenda",             label: "Agenda" },
  { href: "/empregos",           label: "Empregos" },
];

function openMobileDrawer() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("mobile-drawer-open"));
  }
}

export default function Header() {
  return (
    <header style={{
      background: "white",
      borderBottom: "1px solid var(--border)",
      position: "sticky", top: 0, zIndex: 80,
      boxShadow: "var(--shadow-s)",
    }}>
      {/* ── Mobile header (<1024px): logo + busca + hamburger, altura 56px ── */}
      <div
        className="lg:hidden"
        style={{
          height: 56,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 12,
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, textDecoration: "none" }}>
          <svg width="28" height="28" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" fill="none" stroke="#0a7a6b" strokeWidth="2"/>
            <circle cx="16" cy="16" r="8"  fill="none" stroke="#0a7a6b" strokeWidth="2"/>
            <circle cx="16" cy="16" r="3"  fill="#0a7a6b"/>
          </svg>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "var(--ink)", lineHeight: 1 }}>
            Foz <span style={{ color: "var(--teal)" }}>em</span> Foco
          </span>
        </Link>

        <div style={{ marginLeft: "auto", display: "flex", gap: 4, alignItems: "center" }}>
          <Link
            href="/busca"
            aria-label="Buscar"
            style={{
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ink)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
            </svg>
          </Link>
          <button
            aria-label="Abrir menu"
            onClick={openMobileDrawer}
            style={{
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--ink)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="7"  x2="20" y2="7"  />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Desktop header (≥1024px) ── */}
      <div
        className="hidden lg:flex container"
        style={{ alignItems: "center", padding: "12px 20px", gap: 16 }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <svg width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" fill="none" stroke="#0a7a6b" strokeWidth="2"/>
            <circle cx="16" cy="16" r="9"  fill="none" stroke="#0a7a6b" strokeWidth="2"/>
            <circle cx="16" cy="16" r="4"  fill="#0a7a6b"/>
          </svg>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 400, color: "var(--ink)", letterSpacing: "-0.01em" }}>
            Foz <span style={{ color: "var(--teal)" }}>em</span> Foco
          </span>
        </Link>

        <div style={{ width: 1, height: 28, background: "var(--border)", flexShrink: 0 }} />

        <nav style={{ display: "flex", gap: 2, flex: 1, flexWrap: "wrap", overflow: "hidden", maxHeight: 36 }}>
          {navItems.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              padding: "6px 10px", borderRadius: "var(--r-s)", fontSize: 14,
              color: "var(--ink-3)", borderBottom: "2px solid transparent",
              whiteSpace: "nowrap",
            }}>{label}</Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <Link href="/busca" style={{
            background: "var(--paper-2)", padding: "7px 14px", borderRadius: 999,
            display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--ink-3)",
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Buscar
          </Link>
          <Link href="/anuncie" className="btn btn-primary btn-sm">Anuncie</Link>
          <button className="btn btn-outline btn-sm">Entrar</button>
        </div>
      </div>
    </header>
  );
}
