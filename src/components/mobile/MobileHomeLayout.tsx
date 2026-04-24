"use client";

const teal = "#0a7a6b";
const tealPale = "#e6f4f2";
const ink = "#111";
const border = "#e2e8f0";
const muted = "#888";
const danger = "#c0392b";
const success = "#27ae60";
const warning = "#d4a017";

const DASH = [
  { label: "Clima", value: "28°", sub: "ensolarado", color: warning },
  { label: "USD", value: "R$ 5,42", sub: "↑ 0.3%", color: success },
  { label: "₲", value: "R$ 1.380", sub: "estável", color: success },
  { label: "Amizade", value: "35min", sub: "fila longa", color: danger },
  { label: "Fraternidade", value: "livre", sub: "fluxo normal", color: success },
  { label: "Cataratas", value: "3.040 m³/s", sub: "vazão alta", color: teal },
];

const FEED = [
  { cat: "POLÍTICA", title: "Câmara aprova revisão do IPTU em 2ª votação", time: "há 1h", img: true },
  { cat: "TURISMO", title: "Belmond anuncia reforma histórica do hotel", time: "há 2h", img: true },
  { cat: "ECONOMIA", title: "Sicredi abre 12 novas vagas no centro", time: "há 3h", img: false },
];

export default function MobileHomeLayout() {
  return (
    <div style={{ background: "#f5f7fa", paddingBottom: 120 }}>
      {/* Breaking */}
      <div
        style={{
          background: danger,
          color: "white",
          padding: "8px 16px",
          display: "flex",
          gap: 10,
          alignItems: "center",
          fontSize: 12,
        }}
      >
        <span
          style={{
            background: "white",
            color: danger,
            padding: "2px 8px",
            borderRadius: 999,
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          URGENTE
        </span>
        <span
          style={{
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          Ponte da Amizade tem fila de 35min
        </span>
      </div>

      {/* Dashboard horizontal scroll */}
      <div style={{ padding: "12px 0 8px" }}>
        <div
          style={{
            padding: "0 16px",
            marginBottom: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: muted,
              letterSpacing: "0.08em",
              fontWeight: 600,
            }}
          >
            FOZ AGORA · ATUALIZADO 14:08
          </span>
          <span style={{ fontSize: 10, color: teal, fontWeight: 600 }}>
            Ver tudo
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            padding: "0 16px",
            scrollbarWidth: "none",
          }}
        >
          {DASH.map((d) => (
            <div
              key={d.label}
              style={{
                flexShrink: 0,
                width: 120,
                background: "white",
                border: `1px solid ${border}`,
                borderRadius: 10,
                padding: 10,
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: muted,
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                }}
              >
                {d.label.toUpperCase()}
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: ink,
                  lineHeight: 1,
                }}
              >
                {d.value}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: d.color,
                  marginTop: 4,
                  fontWeight: 500,
                }}
              >
                {d.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard teal */}
      <div style={{ margin: "8px 16px 12px" }}>
        <div
          style={{
            background: teal,
            color: "white",
            borderRadius: 8,
            padding: "14px 16px",
            minHeight: 60,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 8,
                opacity: 0.7,
                letterSpacing: "0.08em",
              }}
            >
              PUBLICIDADE · SICREDI
            </div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              Crédito aprovado em 24h
            </div>
          </div>
          <button
            style={{
              background: "white",
              color: teal,
              border: "none",
              padding: "5px 10px",
              borderRadius: 6,
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            Simular
          </button>
        </div>
      </div>

      {/* Hero card */}
      <div
        style={{
          margin: "0 16px 16px",
          background: "white",
          borderRadius: 12,
          overflow: "hidden",
          border: `1px solid ${border}`,
        }}
      >
        <div
          style={{
            aspectRatio: "16/9",
            background: "#dde2e8",
            backgroundImage:
              "linear-gradient(135deg,#dde2e8 25%,#cdd2d8 25%,#cdd2d8 50%,#dde2e8 50%,#dde2e8 75%,#cdd2d8 75%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div style={{ padding: 14 }}>
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.1em",
              padding: "2px 8px",
              borderRadius: 4,
              background: tealPale,
              color: teal,
              marginBottom: 8,
            }}
          >
            CIDADE
          </span>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 22,
              lineHeight: 1.15,
              color: ink,
              margin: "6px 0 8px",
            }}
          >
            Ponte da Integração começa testes de carga hoje
          </h2>
          <div style={{ fontSize: 12, color: muted }}>
            Clara Medina · 7 min · 12.4K views
          </div>
        </div>
      </div>

      {/* Feed */}
      <div style={{ padding: "0 16px", marginBottom: 12 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: muted,
              fontWeight: 600,
              letterSpacing: "0.08em",
            }}
          >
            ÚLTIMAS
          </span>
          <div style={{ flex: 1, height: 1, background: border }} />
        </div>
        {FEED.map((a, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              padding: "12px 0",
              borderBottom:
                i < FEED.length - 1 ? `1px solid ${border}` : "none",
            }}
          >
            {a.img && (
              <div
                style={{
                  width: 80,
                  height: 80,
                  flexShrink: 0,
                  borderRadius: 8,
                  background: "#dde2e8",
                  backgroundImage:
                    "linear-gradient(135deg,#dde2e8 25%,#cdd2d8 25%,#cdd2d8 50%,#dde2e8 50%,#dde2e8 75%,#cdd2d8 75%)",
                  backgroundSize: "10px 10px",
                }}
              />
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: teal,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  marginBottom: 4,
                }}
              >
                {a.cat}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 15,
                  lineHeight: 1.25,
                  color: ink,
                  marginBottom: 6,
                }}
              >
                {a.title}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: muted,
                  fontFamily: "var(--font-mono)",
                }}
              >
                {a.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter CTA */}
      <div
        style={{
          margin: "0 16px 16px",
          background: teal,
          borderRadius: 12,
          padding: 16,
          color: "white",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            opacity: 0.8,
            letterSpacing: "0.08em",
            marginBottom: 4,
          }}
        >
          NEWSLETTER · 7H TODA MANHÃ
        </div>
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 19,
            marginBottom: 10,
            lineHeight: 1.2,
          }}
        >
          Foz em 5 minutos
        </div>
        <input
          placeholder="seu@email.com"
          style={{
            width: "100%",
            padding: "9px 12px",
            border: "1.5px solid rgba(255,255,255,0.3)",
            borderRadius: 7,
            background: "rgba(255,255,255,0.1)",
            color: "white",
            fontSize: 13,
            outline: "none",
            boxSizing: "border-box",
            marginBottom: 8,
          }}
        />
        <button
          style={{
            width: "100%",
            padding: 10,
            background: "white",
            color: teal,
            border: "none",
            borderRadius: 7,
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          Inscrever grátis →
        </button>
      </div>
    </div>
  );
}
