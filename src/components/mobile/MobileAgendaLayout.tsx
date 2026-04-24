"use client";

const teal = "#0a7a6b";
const tealPale = "#e6f4f2";
const ink = "#111";
const border = "#e2e8f0";
const muted = "#888";
const paper2 = "#f5f7fa";

const TABS = ["Todos", "Cultura", "Gastronomia", "Música", "Esporte", "Infantil"];

const EVENTS = [
  { d: "22", m: "ABR", ter: "QUI", title: "Show Chico César — Acústico", where: "Teatro Barrageiros · 21h", tag: "Música" },
  { d: "23", m: "ABR", ter: "SEX", title: "Feira de Orgânicos", where: "Praça da Paz · 7h–13h", tag: "Gastronomia" },
  { d: "24", m: "ABR", ter: "SÁB", title: "Corrida Noturna 10K", where: "Orla · 19h", tag: "Esporte" },
  { d: "25", m: "ABR", ter: "DOM", title: "Missa na Catedral", where: "Catedral · 10h", tag: "Religioso" },
];

export default function MobileAgendaLayout() {
  return (
    <div style={{ background: "#f5f7fa", paddingBottom: 120 }}>
      {/* Hero */}
      <div style={{ background: ink, padding: "20px 16px", color: "white" }}>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "0.08em",
            marginBottom: 4,
          }}
        >
          AGENDA · MAIO 2026
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 26,
            marginBottom: 6,
          }}
        >
          Eventos em Foz
        </h1>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
          42 eventos esta semana
        </div>
      </div>

      {/* Sub-nav tabs */}
      <div
        style={{
          background: ink,
          padding: "0 8px",
          display: "flex",
          gap: 2,
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        {TABS.map((t, i) => (
          <button
            key={t}
            style={{
              flexShrink: 0,
              padding: "8px 14px",
              background: i === 0 ? "white" : "transparent",
              color: i === 0 ? ink : "rgba(255,255,255,0.7)",
              border: "none",
              borderRadius: i === 0 ? "8px 8px 0 0" : 0,
              fontSize: 13,
              fontWeight: i === 0 ? 600 : 400,
              whiteSpace: "nowrap",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Destaques */}
      <div style={{ padding: "16px 16px 8px" }}>
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
          DESTAQUES · MAIO
        </div>
        <div
          style={{
            background: "white",
            border: `1px solid ${border}`,
            borderRadius: 10,
            overflow: "hidden",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              aspectRatio: "16/8",
              background: "#dde2e8",
              backgroundImage:
                "linear-gradient(135deg,#dde2e8 25%,#cdd2d8 25%,#cdd2d8 50%,#dde2e8 50%,#dde2e8 75%,#cdd2d8 75%)",
              backgroundSize: "20px 20px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                background: ink,
                color: "white",
                borderRadius: 6,
                padding: "4px 10px",
                textAlign: "center",
                minWidth: 44,
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1 }}>
                15
              </div>
              <div
                style={{
                  fontSize: 9,
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.08em",
                }}
              >
                MAI
              </div>
            </div>
            <span
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: teal,
                color: "white",
                padding: "2px 8px",
                borderRadius: 999,
                fontSize: 9,
                fontWeight: 700,
                fontFamily: "var(--font-mono)",
              }}
            >
              PATROCINADO
            </span>
          </div>
          <div style={{ padding: 12 }}>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 18,
                lineHeight: 1.2,
                marginBottom: 4,
              }}
            >
              Festival Sabores da Fronteira
            </div>
            <div
              style={{
                fontSize: 12,
                color: muted,
                marginBottom: 10,
              }}
            >
              Gramadão · 15–17 Mai · 40+ restaurantes
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                style={{
                  flex: 1,
                  padding: "8px",
                  background: teal,
                  color: "white",
                  border: "none",
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Ingressos
              </button>
              <button
                style={{
                  flex: 1,
                  padding: "8px",
                  background: "white",
                  color: ink,
                  border: `1px solid ${border}`,
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                + Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Esta semana */}
      <div style={{ padding: "8px 16px" }}>
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
          ESTA SEMANA
        </div>
        {EVENTS.map((e, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 12,
              padding: "12px 0",
              borderBottom:
                i < EVENTS.length - 1 ? `1px solid ${border}` : "none",
            }}
          >
            <div
              style={{
                width: 52,
                flexShrink: 0,
                background: tealPale,
                border: `1px solid ${border}`,
                borderRadius: 8,
                padding: "8px 0",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: teal,
                  fontWeight: 700,
                }}
              >
                {e.ter}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  lineHeight: 1,
                  margin: "2px 0",
                }}
              >
                {e.d}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: muted,
                }}
              >
                {e.m}
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: 4,
                  background: tealPale,
                  color: teal,
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.06em",
                }}
              >
                {e.tag.toUpperCase()}
              </span>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 15,
                  lineHeight: 1.25,
                  marginTop: 6,
                }}
              >
                {e.title}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: muted,
                  marginTop: 3,
                }}
              >
                {e.where}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hint — unused paper2 to silence linter if needed */}
      <div style={{ display: "none", background: paper2 }} />
    </div>
  );
}
