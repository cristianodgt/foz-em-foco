"use client";

import React, { useCallback, useEffect, useState } from "react";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

type Author = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  bio: string | null;
  image: string | null;
  createdAt?: string;
  _count?: { articles: number };
};

const ROLES = ["super_admin", "editor", "reporter", "estagiario"];

export default function AutoresPage() {
  const [items, setItems] = useState<Author[]>([]);
  const [editing, setEditing] = useState<Author | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("reporter");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/authors");
    const data = await res.json();
    setItems(data.items ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  function resetForm() {
    setEditing(null);
    setName(""); setEmail(""); setPassword(""); setRole("reporter"); setBio("");
  }

  function startEdit(a: Author) {
    setEditing(a);
    setName(a.name ?? ""); setEmail(a.email); setRole(a.role); setBio(a.bio ?? ""); setPassword("");
  }

  async function handleSubmit() {
    if (!name || !email) { alert("Nome e e-mail obrigatórios"); return; }
    setSaving(true);
    try {
      const payload: any = { name, email, role, bio };
      if (password) payload.password = password;
      const res = editing
        ? await fetch(`/api/admin/authors/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/admin/authors", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        alert(e.error ?? "Falha ao salvar");
        return;
      }
      resetForm();
      await load();
    } finally { setSaving(false); }
  }

  async function handleDelete(a: Author) {
    if (!confirm(`Excluir autor "${a.name}"?`)) return;
    const res = await fetch(`/api/admin/authors/${a.id}`, { method: "DELETE" });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      alert(e.error ?? "Falha ao excluir");
      return;
    }
    if (editing?.id === a.id) resetForm();
    await load();
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>
            Autores & Equipe
          </div>
          <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>
            {items.length} usuários cadastrados
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>
            Autores cadastrados
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: BG }}>
                {["Nome", "E-mail", "Papel", "Artigos", ""].map((h, i) => (
                  <th key={i} style={{ padding: "10px 14px", fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((a, i) => (
                <tr key={a.id} style={{ borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                  <td style={{ padding: "14px", fontSize: 13, color: INK, fontWeight: 500 }}>{a.name ?? "—"}</td>
                  <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>{a.email}</td>
                  <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 11, color: TEAL, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>{a.role}</td>
                  <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 13, color: INK, fontWeight: 600 }}>{a._count?.articles ?? 0}</td>
                  <td style={{ padding: "14px", textAlign: "right", whiteSpace: "nowrap" }}>
                    <button onClick={() => startEdit(a)} style={btn}>Editar</button>{" "}
                    <button onClick={() => handleDelete(a)} style={btnDanger}>Excluir</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={5} style={{ padding: 30, textAlign: "center", color: MUTED, fontSize: 13 }}>Nenhum autor cadastrado.</td></tr>}
            </tbody>
          </table>
        </div>

        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", alignSelf: "start" }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK, display: "flex", justifyContent: "space-between" }}>
            {editing ? "Editar autor" : "Novo autor"}
            {editing && <button onClick={resetForm} style={linkBtn}>cancelar</button>}
          </div>
          <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Nome"><input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} /></Field>
            <Field label="E-mail"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} /></Field>
            <Field label={editing ? "Nova senha (deixe vazio p/ manter)" : "Senha"}>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} />
            </Field>
            <Field label="Papel">
              <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Bio"><textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} style={{ ...inputStyle, resize: "none" }} /></Field>
            <button disabled={saving} onClick={handleSubmit} style={{ padding: "10px 16px", background: TEAL, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: saving ? "wait" : "pointer", opacity: saving ? 0.6 : 1 }}>
              {saving ? "Salvando..." : editing ? "Atualizar" : "Criar autor"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = { padding: "9px 12px", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, width: "100%", outline: "none", background: BG, color: INK };
const btn: React.CSSProperties = { padding: "6px 12px", background: "white", color: INK, border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer" };
const btnDanger: React.CSSProperties = { ...btn, color: "#c0392b" };
const linkBtn: React.CSSProperties = { border: "none", background: "transparent", color: MUTED, fontFamily: "var(--font-mono)", fontSize: 11, cursor: "pointer" };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6, fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}
