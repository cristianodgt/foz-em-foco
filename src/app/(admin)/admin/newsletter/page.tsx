"use client";

import React, { useCallback, useEffect, useState } from "react";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

type Sub = { id: string; email: string; name: string | null; active: boolean; createdAt: string };
type Edition = { id: string; subject: string; body: string; sentAt: string | null; sentCount: number; createdAt: string };

export default function NewsletterPage() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [totalSubs, setTotalSubs] = useState(0);
  const [activeSubs, setActiveSubs] = useState(0);
  const [editions, setEditions] = useState<Edition[]>([]);
  const [tab, setTab] = useState<"subs" | "editions">("editions");

  const [subject, setSubject] = useState("");
  const [bodyText, setBodyText] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [sRes, eRes] = await Promise.all([fetch("/api/admin/newsletter/subscribers"), fetch("/api/admin/newsletter/editions")]);
    const s = await sRes.json(); const e = await eRes.json();
    setSubs(s.items ?? []); setTotalSubs(s.total ?? 0); setActiveSubs(s.active ?? 0);
    setEditions(e.items ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function createEdition() {
    if (!subject.trim()) { alert("Assunto obrigatório"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/newsletter/editions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject, body: bodyText }) });
      if (!res.ok) { alert("Falha ao criar"); return; }
      setSubject(""); setBodyText("");
      await load();
    } finally { setSaving(false); }
  }
  async function sendEdition(id: string) {
    if (!confirm("Marcar como enviada? (envio real via Brevo ainda não implementado)")) return;
    await fetch(`/api/admin/newsletter/editions/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ send: true }) });
    await load();
  }
  async function deleteEdition(id: string) {
    if (!confirm("Excluir edição?")) return;
    await fetch(`/api/admin/newsletter/editions/${id}`, { method: "DELETE" });
    await load();
  }
  async function deleteSub(id: string) {
    if (!confirm("Remover inscrito?")) return;
    await fetch(`/api/admin/newsletter/subscribers?id=${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>Newsletter</div>
        <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>{totalSubs} inscritos · {activeSubs} ativos · {editions.length} edições</div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {([["editions", "Edições"], ["subs", "Inscritos"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as any)}
            style={{ padding: "8px 14px", border: `1px solid ${BORDER}`, borderRadius: 8, background: tab === k ? TEAL : "white", color: tab === k ? "white" : INK, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            {l}
          </button>
        ))}
      </div>

      {tab === "editions" ? (
        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
          <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>Edições</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: BG }}>{["Assunto", "Enviada", "Inscritos", ""].map((h, i) => <th key={i} style={th}>{h}</th>)}</tr></thead>
              <tbody>
                {editions.map((e, i) => (
                  <tr key={e.id} style={{ borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                    <td style={{ padding: "14px", fontSize: 13, color: INK, fontWeight: 500 }}>{e.subject}</td>
                    <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>
                      {e.sentAt ? new Date(e.sentAt).toLocaleString("pt-BR") : "—"}
                    </td>
                    <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 13, color: TEAL, fontWeight: 700 }}>{e.sentCount}</td>
                    <td style={{ padding: "14px", textAlign: "right", whiteSpace: "nowrap" }}>
                      {!e.sentAt && <button onClick={() => sendEdition(e.id)} style={{ ...btn, color: TEAL, borderColor: TEAL, marginRight: 6 }}>Enviar</button>}
                      <button onClick={() => deleteEdition(e.id)} style={btnDanger}>Excluir</button>
                    </td>
                  </tr>
                ))}
                {editions.length === 0 && <tr><td colSpan={4} style={empty}>Nenhuma edição.</td></tr>}
              </tbody>
            </table>
          </div>

          <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", alignSelf: "start" }}>
            <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>Nova edição</div>
            <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Assunto"><input value={subject} onChange={(e) => setSubject(e.target.value)} style={input} /></Field>
              <Field label="Corpo"><textarea rows={8} value={bodyText} onChange={(e) => setBodyText(e.target.value)} style={{ ...input, resize: "vertical" }} /></Field>
              <button disabled={saving} onClick={createEdition}
                style={{ padding: "10px 16px", background: TEAL, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: saving ? "wait" : "pointer", opacity: saving ? 0.6 : 1 }}>
                {saving ? "Salvando..." : "Criar edição"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: BG }}>{["E-mail", "Nome", "Ativo", "Inscrito em", ""].map((h, i) => <th key={i} style={th}>{h}</th>)}</tr></thead>
            <tbody>
              {subs.map((s, i) => (
                <tr key={s.id} style={{ borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                  <td style={{ padding: "14px", fontSize: 13, color: INK, fontFamily: "var(--font-mono)" }}>{s.email}</td>
                  <td style={{ padding: "14px", fontSize: 13, color: INK }}>{s.name ?? "—"}</td>
                  <td style={{ padding: "14px", fontSize: 11, fontFamily: "var(--font-mono)", color: s.active ? "#047857" : MUTED, fontWeight: 700 }}>{s.active ? "SIM" : "NÃO"}</td>
                  <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>{new Date(s.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td style={{ padding: "14px", textAlign: "right" }}>
                    <button onClick={() => deleteSub(s.id)} style={btnDanger}>Remover</button>
                  </td>
                </tr>
              ))}
              {subs.length === 0 && <tr><td colSpan={5} style={empty}>Nenhum inscrito.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: "10px 14px", fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", fontWeight: 600 };
const input: React.CSSProperties = { padding: "9px 12px", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, width: "100%", outline: "none", background: BG, color: INK };
const btn: React.CSSProperties = { padding: "6px 12px", background: "white", color: INK, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" };
const btnDanger: React.CSSProperties = { ...btn, color: "#c0392b" };
const empty: React.CSSProperties = { padding: 30, textAlign: "center" as const, color: MUTED, fontSize: 13 };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6, fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}
