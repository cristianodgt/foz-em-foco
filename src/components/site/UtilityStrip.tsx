"use client";

const items = [
  { label: "FOZ",          value: "Seg 21 Abr · 14:08", color: "rgba(255,255,255,0.9)" },
  { label: "Clima",        value: "28°C ☀",             color: "white" },
  { label: "USD",          value: "R$ 5,42 ↑",          color: "#52d9c6" },
  { label: "₲",            value: "R$ 1.380",            color: "#52d9c6" },
  { label: "Amizade",      value: "35min ●",             color: "#ff7675" },
  { label: "Fraternidade", value: "livre ●",             color: "#55efc4" },
  { label: "Cataratas",    value: "3.040 m³/s",          color: "white" },
  { label: "Gasolina",     value: "R$ 5,89",             color: "white" },
];

export default function UtilityStrip() {
  return (
    <div style={{ background: "#111", color: "rgba(255,255,255,0.75)", height: 32, overflow: "hidden", position: "relative" }}>
      <div style={{
        display: "flex", alignItems: "center", height: "100%",
        animation: "utilityTicker 40s linear infinite",
        whiteSpace: "nowrap", width: "max-content",
      }}>
        {[...items, ...items].map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, marginRight: 32, flexShrink: 0 }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 400,
              letterSpacing: "0.06em", color: "rgba(255,255,255,0.45)", textTransform: "uppercase",
            }}>
              {item.label}
            </span>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500,
              color: item.color, letterSpacing: "0.02em",
            }}>
              {item.value}
            </span>
          </span>
        ))}
      </div>

      {/* Fade nas bordas */}
      <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 60, background: "linear-gradient(to right, #111, transparent)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: 60, background: "linear-gradient(to left, #111, transparent)", pointerEvents: "none" }} />

      <style>{`
        @keyframes utilityTicker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
