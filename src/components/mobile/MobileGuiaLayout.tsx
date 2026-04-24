"use client";
import { useState } from "react";

const teal = "#0a7a6b";
const tealPale = "#e6f4f2";
const ink = "#111";
const border = "#e2e8f0";
const muted = "#888";
const paper2 = "#f5f7fa";
const warning = "#d4a017";
const success = "#27ae60";
const danger = "#c0392b";

type Business = {
  tier: "OURO" | "PRATA" | "";
  name: string;
  cat: string;
  rating: string;
  reviews: number;
  price: string;
  open: boolean;
};

const CATS: [string, number, boolean?][] = [
  ["Restaurantes", 312, true],
  ["Hotéis", 87],
  ["Saúde", 198],
  ["Compras", 265],
  ["Educação", 143],
  ["Beleza", 184],
];

const BUSINESSES: Business[] = [
  { tier: "OURO", name: "Rafain Churrascaria", cat: "Restaurante · Vila Yolanda", rating: "4.8", reviews: 1243, price: "R$80–R$150", open: true },
  { tier: "OURO", name: "Tempero da Terra", cat: "Restaurante · Centro", rating: "4.7", reviews: 892, price: "R$40–R$80", open: true },
  { tier: "PRATA", name: "Trapiche", cat: "Bar · Gramadão", rating: "4.6", reviews: 634, price: "R$30–R$60", open: true },
  { tier: "", name: "Pizza dos Amigos", cat: "Pizzaria · Vila A", rating: "4.4", reviews: 412, price: "R$25–R$50", open: false },
];

export default function MobileGuiaLayout() {
  const [activeCat, setActiveCat] = useState("Restaurantes");

  return (
    <div style={{ background: "#f5f7fa", paddingBottom: 120 }}>
      {/* Hero search */}
      <div style={{ background: ink, padding: "20px 16px", color: "white" }}>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 26,
            marginBottom: 4,
            lineHeight: 1,
          }}
        >
          Guia de Foz
        </h1>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(255,255,255,0.5)",
            marginBottom: 14,
          }}
        >
          1.847 negócios · 12K avaliações
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <input
            placeholder="Buscar restaurante, hotel..."
            style={{
              flex: 1,
              padding: "9px 12px",
              border: "1.5px solid rgba(255,255,255,0.2)",
              borderRadius: 7,
              background: "rgba(255,255,255,0.1)",
              color: "white",
              fontSize: 13,
              outline: "none",
            }}
          />
          <button
            style={{
              padding: "0 16px",
              background: teal,
              color: "white",
              border: "none",
              borderRadius: 7,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Buscar
          </button>
        </div>
        <div
          style={{
            display: "flex",
            gap: 6,
            marginTop: 10,
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {["Aberto agora", "Delivery", "Pet friendly", "Aceita Pix", "Vista pro rio"].map(
            (t) => (
              <button
                key={t}
                style={{
                  padding: "4px 10px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: 11,
                  whiteSpace: "nowrap",
                }}
              >
                {t}
              </button>
            )
          )}
        </div>
      </div>

      {/* Category chips */}
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          gap: 6,
          overflowX: "auto",
          scrollbarWidth: "none",
          background: "white",
          borderBottom: `1px solid ${border}`,
        }}
      >
        {CATS.map(([n, c]) => {
          const active = activeCat === n;
          return (
            <button
              key={n}
              onClick={() => setActiveCat(n)}
              style={{
                flexShrink: 0,
                padding: "8px 14px",
                borderRadius: 8,
                border: active
                  ? `1px solid ${teal}`
                  : `1px solid ${border}`,
                background: active ? tealPale : "white",
                color: active ? teal : ink,
                fontSize: 13,
                fontWeight: active ? 600 : 500,
                whiteSpace: "nowrap",
                display: "flex",
                gap: 6,
                alignItems: "center",
              }}
            >
              {n}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  opacity: 0.7,
                }}
              >
                {c}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sort bar */}
      <div
        style={{
          padding: "10px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: paper2,
        }}
      >
        <div style={{ fontSize: 12, color: muted }}>
          <strong style={{ color: ink }}>312 resultados</strong>
        </div>
        <button
          style={{
            background: "white",
            border: `1px solid ${border}`,
            padding: "5px 10px",
            borderRadius: 6,
            fontSize: 11,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
          </svg>
          Filtros
        </button>
      </div>

      {/* Business cards */}
      <div style={{ padding: "8px 16px" }}>
        {BUSINESSES.map((b) => (
          <div
            key={b.name}
            style={{
              background: "white",
              marginBottom: 10,
              border:
                b.tier === "OURO"
                  ? `1.5px solid ${warning}`
                  : b.tier === "PRATA"
                  ? "1.5px solid #ccc"
                  : `1px solid ${border}`,
              borderTop: b.tier
                ? `3px solid ${b.tier === "OURO" ? warning : "#888"}`
                : undefined,
              borderRadius: 10,
              padding: 12,
            }}
          >
            <div style={{ display: "flex", gap: 10 }}>
              <div
                style={{
                  width: 70,
                  height: 70,
                  flexShrink: 0,
                  borderRadius: 8,
                  background: "#dde2e8",
                  backgroundImage:
                    "linear-gradient(135deg,#dde2e8 25%,#cdd2d8 25%,#cdd2d8 50%,#dde2e8 50%,#dde2e8 75%,#cdd2d8 75%)",
                  backgroundSize: "10px 10px",
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 3,
                  }}
                >
                  {b.tier && (
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        padding: "1px 6px",
                        borderRadius: 999,
                        background: b.tier === "OURO" ? warning : "#888",
                        color: "white",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      ★ {b.tier}
                    </span>
                  )}
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {b.name}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: muted,
                    marginBottom: 4,
                  }}
                >
                  {b.cat} · {b.price}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: warning }}>★</span>
                  <strong>{b.rating}</strong>
                  <span style={{ color: muted, fontSize: 10 }}>
                    ({b.reviews})
                  </span>
                  <span
                    style={{
                      marginLeft: "auto",
                      fontSize: 10,
                      fontWeight: 600,
                      color: b.open ? success : danger,
                    }}
                  >
                    {b.open ? "● Aberto" : "○ Fechado"}
                  </span>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 6,
                marginTop: 10,
                paddingTop: 10,
                borderTop: `1px solid ${border}`,
              }}
            >
              <button
                style={{
                  flex: 1,
                  padding: "6px",
                  border: `1px solid ${border}`,
                  borderRadius: 6,
                  background: "white",
                  fontSize: 11,
                  fontWeight: 500,
                }}
              >
                Ligar
              </button>
              <button
                style={{
                  flex: 1,
                  padding: "6px",
                  border: `1px solid ${border}`,
                  borderRadius: 6,
                  background: "white",
                  fontSize: 11,
                  fontWeight: 500,
                }}
              >
                Rota
              </button>
              {b.tier === "OURO" && (
                <button
                  style={{
                    flex: 1,
                    padding: "6px",
                    border: "none",
                    borderRadius: 6,
                    background: teal,
                    color: "white",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  Reservar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
