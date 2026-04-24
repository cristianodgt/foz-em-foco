"use client";
import Link from "next/link";
import { useEffect } from "react";

type Props = { open: boolean; onClose: () => void };

const editorias = [
  { nome: "Cidade", slug: "cidade", color: "#c0392b" },
  { nome: "Política", slug: "politica", color: "#2874a6" },
  { nome: "Economia", slug: "economia", color: "#1e8449" },
  { nome: "Turismo", slug: "turismo", color: "#0a7a6b" },
  { nome: "Paraguai", slug: "paraguai", color: "#6c3483" },
  { nome: "Cultura", slug: "cultura", color: "#b84c00" },
  { nome: "Esporte", slug: "esporte", color: "#d4a017" },
  { nome: "Itaipu", slug: "itaipu", color: "#065a4f" },
];

const ferramentas = [
  { label: "Empregos", href: "/empregos" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Anuncie aqui", href: "/anuncie" },
  { label: "Câmbio", href: "/cambio" },
  { label: "Status das pontes", href: "/pontes" },
];

const institucional = [
  { label: "Quem somos", href: "/sobre" },
  { label: "Contato", href: "/contato" },
  { label: "Privacidade", href: "/privacidade" },
  { label: "Termos", href: "/termos" },
];

export default function MobileDrawer({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        aria-hidden={!open}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity .25s",
          zIndex: 90,
        }}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="Menu"
        aria-hidden={!open}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(320px, 86vw)",
          background: "white",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform .28s ease",
          zIndex: 100,
          boxShadow: "-4px 0 20px rgba(0,0,0,0.12)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: "#111" }}>Menu</div>
          <button
            onClick={onClose}
            aria-label="Fechar menu"
            style={{
              marginLeft: "auto",
              width: 36,
              height: 36,
              border: "none",
              background: "transparent",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* User / Login */}
        <div style={{ padding: 16 }}>
          <div
            style={{
              background: "white",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: 14,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#e6f4f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0a7a6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21a8 8 0 1 0-16 0" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>Acessar conta</div>
              <div style={{ fontSize: 12, color: "#888" }}>Entre para personalizar</div>
            </div>
            <Link
              href="/login"
              onClick={onClose}
              style={{
                background: "#0a7a6b",
                color: "white",
                textDecoration: "none",
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                minHeight: 36,
                display: "flex",
                alignItems: "center",
              }}
            >
              Entrar
            </Link>
          </div>
        </div>

        {/* Editorias */}
        <div style={{ padding: "0 16px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 10 }}>
            EDITORIAS
          </div>
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
            {editorias.map((e, i) => (
              <Link
                key={e.slug}
                href={`/categoria/${e.slug}`}
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderBottom: i < editorias.length - 1 ? "1px solid #e2e8f0" : "none",
                  color: "#111",
                  textDecoration: "none",
                  minHeight: 44,
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: "50%", background: e.color, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 15 }}>{e.nome}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* Ferramentas */}
        <div style={{ padding: "0 16px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 10 }}>
            FERRAMENTAS
          </div>
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
            {ferramentas.map((t, i) => (
              <Link
                key={t.href}
                href={t.href}
                onClick={onClose}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderBottom: i < ferramentas.length - 1 ? "1px solid #e2e8f0" : "none",
                  color: "#111",
                  textDecoration: "none",
                  minHeight: 44,
                }}
              >
                <span style={{ flex: 1, fontSize: 15 }}>{t.label}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2">
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        {/* PWA install banner */}
        <div style={{ padding: "0 16px" }}>
          <div style={{ background: "#0a7a6b", borderRadius: 12, padding: 16, color: "white", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 16 }}>Instalar o app</div>
            </div>
            <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 12, lineHeight: 1.4 }}>
              Adicione à tela inicial. Funciona offline.
            </div>
            <button
              onClick={() => {
                window.dispatchEvent(new Event("pwa-install-request"));
                onClose();
              }}
              style={{
                background: "white",
                color: "#0a7a6b",
                border: "none",
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                minHeight: 40,
              }}
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Institucional */}
        <div style={{ padding: "0 16px 20px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#888", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 10 }}>
            INSTITUCIONAL
          </div>
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
            {institucional.map((t, i) => (
              <Link
                key={t.href}
                href={t.href}
                onClick={onClose}
                style={{
                  display: "flex",
                  padding: "12px 14px",
                  borderBottom: i < institucional.length - 1 ? "1px solid #e2e8f0" : "none",
                  fontSize: 14,
                  color: "#555",
                  textDecoration: "none",
                  minHeight: 44,
                  alignItems: "center",
                }}
              >
                {t.label}
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
