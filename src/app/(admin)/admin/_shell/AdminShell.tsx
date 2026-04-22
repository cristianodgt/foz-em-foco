"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type NavItem = { href: string; label: string; icon: string; badge?: number; badgeColor?: string };
type NavGroup = { label: string; items: NavItem[] };

const PATHS: Record<string, React.ReactNode> = {
  dashboard: (<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></>),
  articles: (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>),
  media: (<><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>),
  categories: (<><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></>),
  authors: (<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>),
  comments: (<><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></>),
  guia: (<><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></>),
  ads: (<><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>),
  newsletter: (<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></>),
  agenda: (<><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>),
  settings: (<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82 2 2 0 0 1-2.83 2.83 1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0 1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33 2 2 0 0 1-2.83-2.83 1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4 1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82 2 2 0 0 1 2.83-2.83 1.65 1.65 0 0 0 1.82.33 1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0 1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33 2 2 0 0 1 2.83 2.83 1.65 1.65 0 0 0-.33 1.82 1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></>),
};

const Icon = ({ name, size = 16, color = "currentColor" }: { name: string; size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    {PATHS[name] || null}
  </svg>
);

const GROUPS: NavGroup[] = [
  {
    label: "Conteúdo",
    items: [
      { href: "/admin", label: "Dashboard", icon: "dashboard" },
      { href: "/admin/noticias", label: "Notícias", icon: "articles" },
      { href: "/admin/midia", label: "Biblioteca de Mídia", icon: "media" },
      { href: "/admin/categorias", label: "Categorias & Tags", icon: "categories" },
      { href: "/admin/autores", label: "Autores", icon: "authors" },
      { href: "/admin/comentarios", label: "Comentários", icon: "comments", badge: 12, badgeColor: "#c0392b" },
    ],
  },
  {
    label: "Monetização",
    items: [
      { href: "/admin/guia", label: "Guia Comercial", icon: "guia", badge: 3, badgeColor: "#d4a017" },
      { href: "/admin/anuncios", label: "Anúncios & Slots", icon: "ads" },
      { href: "/admin/newsletter", label: "Newsletter", icon: "newsletter" },
      { href: "/admin/agenda", label: "Agenda & Empregos", icon: "agenda" },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/admin/configuracoes", label: "Configurações", icon: "settings" },
    ],
  },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = (href: string) => href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f0f2f5", fontFamily: "Outfit, sans-serif" }}>
      <aside style={{ width: 240, flexShrink: 0, background: "#0f1923", display: "flex", flexDirection: "column", position: "sticky", top: 0, height: "100vh", overflowY: "auto" }}>
        <div style={{ padding: "22px 20px 18px", borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, textDecoration: "none" }}>
            <svg width="28" height="28" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="14" fill="none" stroke="#0a7a6b" strokeWidth="1.5"/>
              <circle cx="16" cy="16" r="9" fill="none" stroke="#0a7a6b" strokeWidth="1.5"/>
              <circle cx="16" cy="16" r="4" fill="#0a7a6b"/>
            </svg>
            <span style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: 18, color: "white", fontWeight: 400 }}>
              Foz <span style={{ color: "#52d9c6" }}>em</span> Foco
            </span>
          </Link>
          <div style={{ fontSize: 10, fontFamily: "monospace", color: "rgba(255,255,255,.25)", letterSpacing: "0.14em" }}>PAINEL ADMINISTRATIVO</div>
        </div>
        <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 6 }}>
          {GROUPS.map(({ label, items }) => (
            <div key={label} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 10, fontFamily: "monospace", color: "rgba(255,255,255,.2)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "6px 8px 4px" }}>{label}</div>
              {items.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link key={item.href} href={item.href} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 8, color: active ? "white" : "rgba(255,255,255,.62)", background: active ? "rgba(10,122,107,.18)" : "transparent", fontSize: 13, fontWeight: active ? 600 : 400, textDecoration: "none", marginBottom: 2, borderLeft: active ? "2px solid #0a7a6b" : "2px solid transparent" }}>
                    <Icon name={item.icon} size={15} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.badge !== undefined && (
                      <span style={{ background: item.badgeColor || "#0a7a6b", color: "white", fontSize: 10, fontWeight: 700, padding: "1px 7px", borderRadius: 999, fontFamily: "monospace" }}>{item.badge}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,.07)", fontSize: 11, color: "rgba(255,255,255,.35)", fontFamily: "monospace" }}>
          v1.0 · fozemfoco.com.br
        </div>
      </aside>
      <main style={{ flex: 1, overflow: "auto" }}>
        <div style={{ flex: 1, padding: 28 }}>{children}</div>
      </main>
    </div>
  );
}
