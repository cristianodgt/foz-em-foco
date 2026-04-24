"use client";
import { useEffect, useState } from "react";

const AD_INVENTORY = [
  {
    tag: "GASTRONOMIA · RAFAIN",
    label: "30% off — jantar fondue só hoje",
    cta: "Reservar",
    color: "#b84c00",
    gradient: "linear-gradient(135deg,#b84c00,#d35400)",
  },
  {
    tag: "FINANCEIRO · SICREDI",
    label: "Crédito empresarial com taxa reduzida",
    cta: "Simular",
    color: "#0a7a6b",
    gradient: "linear-gradient(135deg,#065a4f,#0a7a6b)",
  },
  {
    tag: "TURISMO · ITAIPU",
    label: "Tour Iluminação com 20% de desconto",
    cta: "Comprar",
    color: "#2874a6",
    gradient: "linear-gradient(135deg,#1a5276,#2874a6)",
  },
  {
    tag: "COMPRAS · SHOPPING JL",
    label: "Liquidação de outono — até 50% off",
    cta: "Ver lojas",
    color: "#6d3480",
    gradient: "linear-gradient(135deg,#4a235a,#6d3480)",
  },
];

const DISMISS_KEY = "mobile-sticky-ad-dismissed-at";
const DAY_MS = 24 * 60 * 60 * 1000;

export default function MobileStickyAd() {
  const [mounted, setMounted] = useState(false);
  const [closed, setClosed] = useState(false);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setMounted(true);
    try {
      const at = localStorage.getItem(DISMISS_KEY);
      if (at && Date.now() - parseInt(at, 10) < DAY_MS) {
        setClosed(true);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (closed) return;
    const i = setInterval(() => setIdx((n) => (n + 1) % AD_INVENTORY.length), 6000);
    return () => clearInterval(i);
  }, [closed]);

  function dismiss() {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
    setClosed(true);
  }

  if (!mounted || closed) return null;

  const ad = AD_INVENTORY[idx];
  return (
    <div
      className="md:hidden"
      role="complementary"
      aria-label="Publicidade"
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: "calc(60px + env(safe-area-inset-bottom))",
        zIndex: 35,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          pointerEvents: "auto",
          margin: "0 12px",
          width: "100%",
          maxWidth: 640,
          height: 56,
          background: ad.gradient,
          color: "white",
          borderRadius: 8,
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 8, opacity: 0.7, letterSpacing: "0.08em" }}>
            PUBLICIDADE · {ad.tag}
          </div>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {ad.label}
          </div>
        </div>
        <button
          style={{
            background: "white",
            color: ad.color,
            border: "none",
            padding: "6px 12px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            flexShrink: 0,
            minHeight: 32,
          }}
        >
          {ad.cta}
        </button>
        <button
          onClick={dismiss}
          aria-label="Fechar publicidade"
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            width: 24,
            height: 24,
            borderRadius: "50%",
            color: "white",
            cursor: "pointer",
            fontSize: 14,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
