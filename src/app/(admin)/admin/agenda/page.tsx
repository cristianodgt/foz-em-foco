"use client";

import React, { useCallback, useEffect, useState } from "react";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

type Event = {
  id: string; title: string; slug: string; description: string | null;
  local: string | null; startDate: string; endDate: string | null;
  free: boolean; active: boolean; approved: boolean;
};
type Job = {
  id: string; title: string; slug: string; company: string; description: string;
  area: string | null; local: string | null; remote: boolean;
  active: boolean; approved: boolean;
};

export default function AgendaPage() {
  const [tab, setTab] = useState<"events" | "jobs">("events");
  const [events, setEvents] = useState<Event[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [evTitle, setEvTitle] = useState("");
  const [evLocal, setEvLocal] = useState("");
  const [evStart, setEvStart] = useState("");
  const [evFree, setEvFree] = useState(false);

  const [jbTitle, setJbTitle] = useState("");
  const [jbCompany, setJbCompany] = useState("");
  const [jbArea, setJbArea] = useState("");
  const [jbDesc, setJbDesc] = useState("");

  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const [eRes, jRes] = await Promise.all([fetch("/api/admin/events"), fetch("/api/admin/jobs")]);
    const eData = await eRes.json(); const jData = await jRes.json();
    setEvents(eData.items ?? []); setJobs(jData.items ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function createEvent() {
    if (!evTitle || !evStart) { alert("Título e data obrigatórios"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: evTitle, local: evLocal, startDate: evStart, free: evFree, approved: true }) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); alert(e.error ?? "Falha"); return; }
      setEvTitle(""); setEvLocal(""); setEvStart(""); setEvFree(false);
      await load();
    } finally { setSaving(false); }
  }
  async function createJob() {
    if (!jbTitle || !jbCompany) { alert("Título e empresa obrigatórios"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/jobs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: jbTitle, company: jbCompany, area: jbArea, description: jbDesc, approved: true }) });
      if (!res.ok) { const e = await res.json().catch(() => ({})); alert(e.error ?? "Falha"); return; }
      setJbTitle(""); setJbCompany(""); setJbArea(""); setJbDesc("");
      await load();
    } finally { setSaving(false); }
  }
  async function togglePatchEvent(id: string, data: any) {
    await fetch(`/api/admin/events/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    await load();
  }
  async function togglePatchJob(id: string, data: any) {
    await fetch(`/api/admin/jobs/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    await load();
  }
  async function deleteEvent(id: string) { if (!confirm("Excluir evento?")) return; await fetch(`/api/admin/events/${id}`, { method: "DELETE" }); await load(); }
  async function deleteJob(id: string) { if (!confirm("Excluir vaga?")) return; await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" }); await load(); }

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>Agenda & Empregos</div>
        <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>{events.length} eventos · {jobs.length} vagas</div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {([["events", "Eventos"], ["jobs", "Vagas"]] as const).map(([k, l]) => (
          <button key={k} onClick={() => setTab(k as any)}
            style={{ padding: "8px 14px", border: `1px solid ${BORDER}`, borderRadius: 8, background: tab === k ? TEAL : "white", color: tab === k ? "white" : INK, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
          {tab === "events" ? (
            <>
              <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>Eventos</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: BG }}>
                  {["Título", "Local", "Data", "Status", ""].map((h, i) => <th key={i} style={th}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {events.map((e, i) => (
                    <tr key={e.id} style={{ borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                      <td style={{ padding: "14px", fontSize: 13, color: INK, fontWeight: 500 }}>{e.title}</td>
                      <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>{e.local ?? "—"}</td>
                      <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>{new Date(e.startDate).toLocaleDateString("pt-BR")}</td>
                      <td style={{ padding: "14px" }}>
                        <button onClick={() => togglePatchEvent(e.id, { approved: !e.approved })} style={pill(e.approved)}>{e.approved ? "APROVADO" : "PENDENTE"}</button>
                      </td>
                      <td style={{ padding: "14px", textAlign: "right", whiteSpace: "nowrap" }}>
                        <button onClick={() => deleteEvent(e.id)} style={btnDanger}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                  {events.length === 0 && <tr><td colSpan={5} style={empty}>Nenhum evento.</td></tr>}
                </tbody>
              </table>
            </>
          ) : (
            <>
              <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>Vagas</div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr style={{ background: BG }}>
                  {["Título", "Empresa", "Área", "Status", ""].map((h, i) => <th key={i} style={th}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {jobs.map((j, i) => (
                    <tr key={j.id} style={{ borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                      <td style={{ padding: "14px", fontSize: 13, color: INK, fontWeight: 500 }}>{j.title}</td>
                      <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>{j.company}</td>
                      <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>{j.area ?? "—"}</td>
                      <td style={{ padding: "14px" }}>
                        <button onClick={() => togglePatchJob(j.id, { approved: !j.approved })} style={pill(j.approved)}>{j.approved ? "APROVADA" : "PENDENTE"}</button>
                      </td>
                      <td style={{ padding: "14px", textAlign: "right" }}>
                        <button onClick={() => deleteJob(j.id)} style={btnDanger}>Excluir</button>
                      </td>
                    </tr>
                  ))}
                  {jobs.length === 0 && <tr><td colSpan={5} style={empty}>Nenhuma vaga.</td></tr>}
                </tbody>
              </table>
            </>
          )}
        </div>

        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", alignSelf: "start" }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>
            {tab === "events" ? "Novo evento" : "Nova vaga"}
          </div>
          <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
            {tab === "events" ? (
              <>
                <Field label="Título"><input value={evTitle} onChange={(e) => setEvTitle(e.target.value)} style={input} /></Field>
                <Field label="Local"><input value={evLocal} onChange={(e) => setEvLocal(e.target.value)} style={input} /></Field>
                <Field label="Data e hora"><input type="datetime-local" value={evStart} onChange={(e) => setEvStart(e.target.value)} style={input} /></Field>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: INK }}>
                  <input type="checkbox" checked={evFree} onChange={(e) => setEvFree(e.target.checked)} /> Entrada gratuita
                </label>
                <button disabled={saving} onClick={createEvent} style={primaryBtn(saving)}>{saving ? "Salvando..." : "Criar evento"}</button>
              </>
            ) : (
              <>
                <Field label="Título"><input value={jbTitle} onChange={(e) => setJbTitle(e.target.value)} style={input} /></Field>
                <Field label="Empresa"><input value={jbCompany} onChange={(e) => setJbCompany(e.target.value)} style={input} /></Field>
                <Field label="Área"><input value={jbArea} onChange={(e) => setJbArea(e.target.value)} style={input} /></Field>
                <Field label="Descrição"><textarea rows={4} value={jbDesc} onChange={(e) => setJbDesc(e.target.value)} style={{ ...input, resize: "none" }} /></Field>
                <button disabled={saving} onClick={createJob} style={primaryBtn(saving)}>{saving ? "Salvando..." : "Criar vaga"}</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const th: React.CSSProperties = { padding: "10px 14px", fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", fontWeight: 600 };
const input: React.CSSProperties = { padding: "9px 12px", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, width: "100%", outline: "none", background: BG, color: INK };
const btnDanger: React.CSSProperties = { padding: "6px 12px", background: "white", color: "#c0392b", border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer" };
const empty: React.CSSProperties = { padding: 30, textAlign: "center" as const, color: MUTED, fontSize: 13 };
const pill = (ok: boolean): React.CSSProperties => ({
  padding: "3px 8px", border: "none", borderRadius: 99, background: ok ? "#e6f9f3" : "#fef3c7", color: ok ? "#047857" : "#92400e", fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700, cursor: "pointer",
});
const primaryBtn = (s: boolean): React.CSSProperties => ({
  padding: "10px 16px", background: TEAL, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: s ? "wait" : "pointer", opacity: s ? 0.6 : 1,
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6, fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}
