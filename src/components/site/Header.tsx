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

export default function Header() {
  return (
    <header style={{
      background: "white",
      borderBottom: "1px solid var(--border)",
      position: "sticky", top: 0, zIndex: 80,
      boxShadow: "var(--shadow-s)",
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", padding: "12px 20px", gap: 16 }}>

        {/* Logo */}
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

        {/* Nav desktop */}
        <nav style={{ display: "flex", gap: 2, flex: 1, flexWrap: "wrap", overflow: "hidden", maxHeight: 36 }}>
          {navItems.map(({ href, label }) => (
            <Link key={href} href={href} style={{
              padding: "6px 10px", borderRadius: "var(--r-s)", fontSize: 14,
              color: "var(--ink-3)", borderBottom: "2px solid transparent",
              whiteSpace: "nowrap",
            }}>{label}</Link>
          ))}
        </nav>

        {/* Actions */}
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

      {/* Mobile scroll nav */}
      <style>{`
        .mobile-nav-bar { display: none; }
        .mobile-nav-scroll { display: flex; overflow-x: auto; scrollbar-width: none; }
        .mobile-nav-scroll::-webkit-scrollbar { display: none; }
        @media (max-width: 899px) { .mobile-nav-bar { display: block; border-top: 1px solid var(--border); } }
      `}</style>
      <div className="mobile-nav-bar">
        <div className="mobile-nav-scroll">
          {[{ href: "/", label: "Home" }, ...navItems].map(({ href, label }) => (
            <Link key={href} href={href} style={{
              display: "block", padding: "8px 14px", fontSize: 13,
              whiteSpace: "nowrap", flexShrink: 0, color: "var(--ink-3)",
              borderBottom: "2px solid transparent",
            }}>{label}</Link>
          ))}
        </div>
      </div>
    </header>
  );
}
