export default function BreakingBar({ text }: { text?: string | null }) {
  if (!text) return null;
  return (
    <div style={{
      background: "var(--danger)", color: "white",
      padding: "8px 20px", display: "flex", alignItems: "center", gap: 12,
      fontSize: 13, fontWeight: 500,
    }}>
      <span style={{
        background: "white", color: "var(--danger)",
        padding: "2px 10px", borderRadius: 999,
        fontFamily: "var(--font-mono)", fontSize: 10,
        fontWeight: 700, letterSpacing: "0.1em", flexShrink: 0,
      }}>URGENTE</span>
      <span style={{ flex: 1 }}>{text}</span>
      <span style={{ opacity: .7, fontFamily: "var(--font-mono)", fontSize: 10, flexShrink: 0 }}>há 3min</span>
    </div>
  );
}
