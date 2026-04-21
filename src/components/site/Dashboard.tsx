"use client";

const widgets = [
  { label: "Clima · Foz",      val: "28°C",       sub: "☀ Ensolarado · máx 31 · mín 22", color: "#0a7a6b", extra: "Vento 6km/h · UV alto",               trend: [4,5,6,6,7,7,6,6,7,8,7,6] },
  { label: "Câmbio · USD/BRL", val: "R$ 5,42",    sub: "↑ +0,3% hoje · alta recente",     color: "#d35400", extra: "BRL/₲ 1.380 · ARS 0,16",             trend: [5,5,4,5,6,5,6,7,6,8,7,8] },
  { label: "Câmbio · BRL/₲",  val: "1.380",       sub: "↓ −0,1% hoje · estável",          color: "#8e6914", extra: "Referência BNC · 14:00",              trend: [7,6,7,6,5,6,5,6,5,5,4,5] },
  { label: "Pontes · status",  val: "Amizade ⚠",  sub: "Fila 35min · BR→PY",              color: "#c0392b", extra: "Fraternidade: livre 🟢",              trend: [2,3,4,5,6,7,7,7,8,7,6,7] },
  { label: "Cataratas · vazão",val: "3.040 m³/s",  sub: "↑ Acima da média sazonal",        color: "#1a6b5a", extra: "14.200 visitantes ontem",             trend: [4,5,4,6,7,6,8,9,8,8,9,9] },
  { label: "Combustível · Foz",val: "R$ 5,89",    sub: "Gasolina comum · média",          color: "#6c3483", extra: "PY: R$ 4,80 · econ. R$1,09/L",        trend: [5,5,5,6,6,6,6,6,7,7,7,7] },
];

function Spark({ vals, color }: { vals: number[]; color: string }) {
  const max = Math.max(...vals), min = Math.min(...vals);
  const norm = vals.map(v => (v - min) / (max - min || 1));
  const w = 120, h = 30, step = w / (vals.length - 1);
  const pts = norm.map((v, i) => `${i * step},${h - (v * (h - 4) + 2)}`).join(" ");
  return (
    <svg width={w} height={h} style={{ overflow: "visible", opacity: .6 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <circle
        cx={(norm.length - 1) * step}
        cy={h - (norm[norm.length - 1] * (h - 4) + 2)}
        r="3" fill={color}
      />
    </svg>
  );
}

export default function Dashboard() {
  return (
    <section style={{ background: "var(--paper-2)", borderBottom: "1px solid var(--border)", padding: "20px 0 24px" }}>
      <div className="container">
        <div className="row between mb-m" style={{ marginBottom: 14 }}>
          <div>
            <span className="t-h4">Foz agora</span>
            <span className="t-mono color-muted" style={{ marginLeft: 10, fontSize: 11 }}>atualizado 14:08 · dados ao vivo</span>
          </div>
          <button className="btn-ghost btn-sm" style={{ fontSize: 12 }}>personalizar ⚙</button>
        </div>
        <div className="dashboard-grid" style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
          {widgets.map(({ label, val, sub, color, extra, trend }) => (
            <div key={label} style={{
              background: "white", borderRadius: "var(--r-l)",
              padding: "14px 16px", borderTop: `3px solid ${color}`,
              boxShadow: "var(--shadow-s)", cursor: "pointer",
            }}>
              <div className="t-mono color-muted" style={{ marginBottom: 6, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, fontWeight: 400, color: "var(--ink)", lineHeight: 1, marginBottom: 4 }}>{val}</div>
              <div style={{ fontSize: 11, color, fontWeight: 500, marginBottom: 2 }}>{sub}</div>
              <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 8 }}>{extra}</div>
              <Spark vals={trend} color={color} />
            </div>
          ))}
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>
          Fontes: INMET · BCB · Banco Nacional de Ciudad del Este · Itaipu Binacional · PRF · ANP
          <span style={{ float: "right" }}>
            <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "var(--teal)", marginRight: 5, verticalAlign: "middle" }}/>
            dados ao vivo · patrocinado por <strong style={{ color: "var(--teal)" }}>Sicredi Foz</strong>
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .dashboard-grid { grid-template-columns: repeat(3,1fr) !important; } }
        @media (max-width: 640px)  { .dashboard-grid { grid-template-columns: repeat(2,1fr) !important; } }
      `}</style>
    </section>
  );
}
