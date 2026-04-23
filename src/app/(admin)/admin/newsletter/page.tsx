import { prisma } from "@/lib/prisma";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

export default async function NewsletterPage() {
  const [subscribers, editions, total, sentEditions] = await Promise.all([
    prisma.newsletterSubscriber.findMany({ where: { active: true }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.newsletterEdition.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
    prisma.newsletterEdition.count({ where: { sentAt: { not: null } } }),
  ]);

  const lastEdition = editions.find((e) => e.sentAt);
  const avgSent = lastEdition?.sentCount ?? 0;

  const kpis = [
    { label: "Inscritos ativos", value: total.toLocaleString("pt-BR"), color: TEAL },
    { label: "Edições enviadas", value: sentEditions.toString(), color: "#047857" },
    { label: "Último envio", value: avgSent.toLocaleString("pt-BR"), color: "#065a4f" },
    { label: "Taxa abertura", value: "34", suffix: "%", color: "#d35400" },
  ];

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      {/* Hero */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>
            Newsletter
          </div>
          <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>
            {total.toLocaleString("pt-BR")} inscritos ativos · integração Brevo
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{
            padding: "9px 14px", border: `1px solid ${BORDER}`, borderRadius: 8,
            background: "white", fontSize: 13, color: INK, fontWeight: 500, cursor: "pointer",
          }}>
            Exportar lista
          </button>
          <button style={{
            padding: "9px 16px", background: TEAL, borderRadius: 8,
            fontSize: 13, color: "white", fontWeight: 600, border: "none", cursor: "pointer",
          }}>
            + Nova edição
          </button>
        </div>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{
            background: "white", border: `1px solid ${BORDER}`, borderRadius: 14,
            padding: "18px 20px", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: k.color }} />
            <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 10 }}>{k.label}</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 30, lineHeight: 1, color: INK }}>
              {k.value}
              {k.suffix && <span style={{ fontSize: 14, color: MUTED, marginLeft: 3 }}>{k.suffix}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Dois cards lado a lado */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20 }}>
        {/* Inscritos */}
        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>
            Inscritos recentes
          </div>
          {subscribers.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: MUTED, fontSize: 13 }}>
              Nenhum inscrito ainda.
            </div>
          ) : (
            subscribers.map((s, i) => (
              <div key={s.id} style={{
                padding: "12px 22px",
                borderBottom: i < subscribers.length - 1 ? `1px solid ${BORDER}` : "none",
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "#e6f9f3", color: TEAL,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {s.email[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0, fontSize: 13, color: INK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.email}
                </div>
                <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED }}>
                  {new Date(s.createdAt).toLocaleDateString("pt-BR")}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edições */}
        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>
            Edições
          </div>
          {editions.length === 0 ? (
            <div style={{ padding: "32px", textAlign: "center", color: MUTED, fontSize: 13 }}>
              Nenhuma edição enviada.
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: BG }}>
                  {["Assunto", "Envio", "Destinatários", "Status"].map((h, i) => (
                    <th key={i} style={{
                      padding: "10px 14px", fontSize: 11, fontFamily: "var(--font-mono)",
                      color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em",
                      textAlign: "left", fontWeight: 600,
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {editions.map((e, i) => {
                  const sent = !!e.sentAt;
                  return (
                    <tr key={e.id} style={{ borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: INK, fontWeight: 500, maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {e.subject}
                      </td>
                      <td style={{ padding: "12px 14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>
                        {sent ? new Date(e.sentAt!).toLocaleDateString("pt-BR") : "—"}
                      </td>
                      <td style={{ padding: "12px 14px", fontFamily: "var(--font-mono)", fontSize: 13, color: sent ? TEAL : MUTED, fontWeight: sent ? 700 : 400 }}>
                        {sent ? e.sentCount.toLocaleString("pt-BR") : "—"}
                      </td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{
                          fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700,
                          padding: "3px 8px", borderRadius: 99,
                          background: sent ? "#e6f9f3" : "#fef3c7",
                          color: sent ? "#047857" : "#92400e",
                        }}>
                          {sent ? "ENVIADA" : "RASCUNHO"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
