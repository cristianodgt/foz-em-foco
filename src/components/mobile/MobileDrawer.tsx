"use client";
import Link from "next/link";
import { useEffect } from "react";

type Props = { open: boolean; onClose: () => void };

const teal = "#0a7a6b";
const border = "#e2e8f0";
const muted = "#888";

const editorias = [
  { nome: "Cidade", slug: "cidade", color: "#c0392b" },
  { nome: "Política", slug: "politica", color: "#2874a6" },
  { nome: "Economia", slug: "economia", color: "#1e8449" },
  { nome: "Turismo", slug: "turismo", color: "#d4a017" },
  { nome: "Paraguai", slug: "paraguai", color: "#6c3483" },
  { nome: "Cultura", slug: "cultura", color: "#d35400" },
  { nome: "Esporte", slug: "esporte", color: "#16a085" },
  { nome: "Itaipu", slug: "itaipu", color: teal },
];

const ferramentas = [
  { label: "Empregos", href: "/empregos" },
  { label: "Newsletter", href: "/newsletter" },
  { label: "Anuncie aqui", href: "/anuncie" },
  { label: "Câmbio ao vivo", href: "/cambio" },
  { label: "Status das pontes", href: "/pontes" },
];

const institucional = [
  { label: "Quem somos", href: "/sobre" },
  { label: "Contato", href: "/contato" },
  { label: "Política de privacidade", href: "/privacidade" },
  { label: "Termos de uso", href: "/termos" },
];

export default function MobileDrawer({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <>
      {/* Overlay preto 40% */}
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
          width: "min(340px, 92vw)",
          background: "#f5f7fa",
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "14px 16px",
            borderBottom: `1px solid ${border}`,
            background: "white",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 18,
              color: "#111",
            }}
          >
            Menu
          </div>
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
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#111"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div style={{ padding: 16 }}>
          {/* User / Login */}
          <div
            style={{
              background: "white",
              border: `1px solid ${border}`,
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "#f5f7fa",
                border: `1px solid ${border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke={muted}
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>
                Entrar no Foz em Foco
              </div>
              <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>
                Salve artigos, receba alertas
              </div>
            </div>
            <Link
              href="/login"
              onClick={onClose}
              style={{
                padding: "7px 14px",
                background: teal,
                color: "white",
                border: "none",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Entrar
            </Link>
          </div>

          {/* Editorias */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: muted,
              letterSpacing: "0.08em",
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            EDITORIAS
          </div>
          <div
            style={{
              background: "white",
              border: `1px solid ${border}`,
              borderRadius: 12,
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            {editorias.map((e, i) => (
              <Link
                key={e.slug}
                href={`/categoria/${e.slug}`}
                onClick={onClose}
                style={{
                  padding: "13px 16px",
                  borderBottom:
                    i < editorias.length - 1 ? `1px solid ${border}` : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  color: "#111",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: e.color,
                  }}
                />
                <span style={{ flex: 1, fontSize: 15, fontWeight: 500 }}>
                  {e.nome}
                </span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={muted}
                  strokeWidth="2"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>

          {/* Ferramentas */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: muted,
              letterSpacing: "0.08em",
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            FERRAMENTAS
          </div>
          <div
            style={{
              background: "white",
              border: `1px solid ${border}`,
              borderRadius: 12,
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            {ferramentas.map((t, i) => (
              <Link
                key={t.href}
                href={t.href}
                onClick={onClose}
                style={{
                  padding: "13px 16px",
                  borderBottom:
                    i < ferramentas.length - 1 ? `1px solid ${border}` : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  color: "#111",
                  textDecoration: "none",
                }}
              >
                <span style={{ flex: 1, fontSize: 15 }}>{t.label}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={muted}
                  strokeWidth="2"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>

          {/* PWA install banner */}
          <div
            style={{
              background: teal,
              borderRadius: 12,
              padding: 16,
              color: "white",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
              >
                <rect x="5" y="2" width="14" height="20" rx="2" />
                <line x1="12" y1="18" x2="12" y2="18.01" />
              </svg>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 17 }}>
                Instalar como app
              </div>
            </div>
            <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 10 }}>
              Tenha Foz em Foco na tela inicial do seu celular. Funciona offline.
            </div>
            <button
              onClick={() => {
                window.dispatchEvent(new Event("pwa-install-request"));
                onClose();
              }}
              style={{
                width: "100%",
                padding: 10,
                background: "white",
                color: teal,
                border: "none",
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Adicionar à tela inicial
            </button>
          </div>

          {/* Institucional */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: muted,
              letterSpacing: "0.08em",
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            SOBRE
          </div>
          <div
            style={{
              background: "white",
              border: `1px solid ${border}`,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            {institucional.map((t, i) => (
              <Link
                key={t.href}
                href={t.href}
                onClick={onClose}
                style={{
                  padding: "13px 16px",
                  borderBottom:
                    i < institucional.length - 1
                      ? `1px solid ${border}`
                      : "none",
                  fontSize: 14,
                  color: muted,
                  textDecoration: "none",
                  display: "block",
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
