"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Item = { id: string; label: string; href: string; icon: React.ReactNode };

const items: Item[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: <path d="M3 10v10h6v-6h6v6h6V10L12 3 3 10z" />,
  },
  {
    id: "news",
    label: "Notícias",
    href: "/categoria/cidade",
    icon: <path d="M4 6h16M4 12h16M4 18h10" />,
  },
  {
    id: "guia",
    label: "Guia",
    href: "/guia",
    icon: (
      <>
        <circle cx="12" cy="10" r="3" />
        <path d="M12 2a8 8 0 0 0-8 8c0 6 8 12 8 12s8-6 8-12a8 8 0 0 0-8-8z" />
      </>
    ),
  },
  {
    id: "agenda",
    label: "Agenda",
    href: "/agenda",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <line x1="8" y1="3" x2="8" y2="7" />
        <line x1="16" y1="3" x2="16" y2="7" />
      </>
    ),
  },
];

export default function BottomNav({ onMoreClick }: { onMoreClick: () => void }) {
  const pathname = usePathname() || "/";

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <nav
      className="md:hidden"
      aria-label="Navegação inferior"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        background: "white",
        borderTop: "1px solid #e2e8f0",
        display: "flex",
        padding: "4px 0 calc(8px + env(safe-area-inset-bottom))",
        boxShadow: "0 -2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {items.map((it) => {
        const active = isActive(it.href);
        return (
          <Link
            key={it.id}
            href={it.href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              padding: "8px 0",
              minHeight: 44,
              textDecoration: "none",
              color: active ? "#0a7a6b" : "#888",
              fontWeight: active ? 600 : 500,
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {it.icon}
            </svg>
            <span style={{ fontSize: 10, lineHeight: 1 }}>{it.label}</span>
          </Link>
        );
      })}
      <button
        onClick={onMoreClick}
        aria-label="Abrir menu"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 3,
          padding: "8px 0",
          minHeight: 44,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "#888",
          fontWeight: 500,
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="5" cy="12" r="1.5" />
          <circle cx="12" cy="12" r="1.5" />
          <circle cx="19" cy="12" r="1.5" />
        </svg>
        <span style={{ fontSize: 10, lineHeight: 1 }}>Mais</span>
      </button>
    </nav>
  );
}
