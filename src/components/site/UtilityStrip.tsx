export default function UtilityStrip() {
  const items = [
    ["Clima",        "28°C ☀",       "white"],
    ["USD",          "R$ 5,42 ↑",    "#52d9c6"],
    ["₲",            "R$ 1.380",     "#52d9c6"],
    ["Amizade",      "35min 🔴",     "#ff7675"],
    ["Fraternidade", "livre 🟢",     "#55efc4"],
    ["Cataratas",    "3.040 m³/s",   "white"],
    ["Gasolina",     "R$ 5,89",      "white"],
  ] as const;

  return (
    <div style={{ background: "var(--ink)", color: "rgba(255,255,255,0.75)", padding: "6px 0", fontSize: 12 }}>
      <style>{`.util-scroll{display:flex;align-items:center;gap:24px;overflow-x:auto;scrollbar-width:none}.util-scroll::-webkit-scrollbar{display:none}`}</style>
      <div className="container">
        <div className="util-scroll">
          <span style={{ fontFamily: "var(--font-mono)", flexShrink: 0 }}>
            <span style={{ color: "rgba(255,255,255,.45)" }}>FOZ · </span>
            <span style={{ fontWeight: 600, color: "white" }}>Seg 21 Abr · 14:08</span>
          </span>
          {items.map(([l, v, c]) => (
            <span key={l} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 5 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, opacity: .55, textTransform: "uppercase", letterSpacing: "0.06em" }}>{l}</span>
              <span style={{ fontWeight: 600, color: c, fontFamily: "var(--font-mono)" }}>{v}</span>
            </span>
          ))}
          <span style={{ marginLeft: "auto", flexShrink: 0, display: "flex", gap: 16 }}>
            <a href="/newsletter" style={{ color: "rgba(255,255,255,.6)", fontSize: 12 }}>Newsletter</a>
            <a href="#" style={{ color: "rgba(255,255,255,.6)", fontSize: 12 }}>App</a>
            <a href="#" style={{ color: "rgba(255,255,255,.6)", fontSize: 12 }}>RSS</a>
          </span>
        </div>
      </div>
    </div>
  );
}
