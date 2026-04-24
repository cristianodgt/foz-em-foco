"use client";

import React, { useCallback, useEffect, useState } from "react";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

type Cat = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  order: number;
  _count?: { articles: number };
};

export default function CategoriasPage() {
  const [items, setItems] = useState<Cat[]>([]);
  const [editing, setEditing] = useState<Cat | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");
  const [color, setColor] = useState("#0a7a6b");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/categories");
    const data = await res.json();
    setItems(data.items ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  function resetForm() {
    setEditing(null);
    setName(""); setSlug(""); setDesc(""); setColor("#0a7a6b");
  }

  function startEdit(c: Cat) {
    setEditing(c);
    setName(c.name); setSlug(c.slug); setDesc(c.description ?? ""); setColor(c.color);
  }

  async function handleSubmit() {
    if (!name.trim()) { alert("Nome é obrigatório"); return; }
    setSaving(true);
    try {
      const payload = { name, slug, description: desc, color };
      const res = editing
        ? await fetch(`/api/admin/categories/${editing.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/admin/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        alert(e.error ?? "Falha ao salvar");
        return;
      }
      resetForm();
      await load();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(c: Cat) {
    if (!confirm(`Excluir categoria "${c.name}"?`)) return;
    const res = await fetch(`/api/admin/categories/${c.id}`, { method: "DELETE" });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      alert(e.error ?? "Falha ao excluir");
      return;
    }
    if (editing?.id === c.id) resetForm();
    await load();
  }

  const total = items.reduce((s, e) => s + (e._count?.articles ?? 0), 0);

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>
            Categorias & Tags
          </div>
          <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>
            {items.length} editorias · {total.toLocaleString("pt-BR")} artigos classificados
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>
        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>
            Categorias existentes
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: BG }}>
                {["Nome", "Slug", "Artigos", ""].map((h, i) => (
                  <th key={i} style={{
                    padding: "10px 14px", fontSize: 11, fontFamily: "var(--font-mono)",
                    color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em",
                    textAlign: i === 2 ? "right" : "left", fontWeight: 600,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((c, i) => (
                <tr key={c.id} style={{ borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                  <td style={{ padding: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, fontWeight: 500, color: INK }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>/categoria/{c.slug}</td>
                  <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 13, color: TEAL, fontWeight: 700, textAlign: "right" }}>
                    {c._count?.articles ?? 0}
                  </td>
                  <td style={{ padding: "14px", textAlign: "right", whiteSpace: "nowrap" }}>
                    <button
                      onClick={() => startEdit(c)}
                      style={{
                        padding: "6px 12px", background: "white", color: INK,
                        border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", marginRight: 6,
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      style={{
                        padding: "6px 12px", background: "white", color: "#c0392b",
                        border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer",
                      }}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr><td colSpan={4} style={{ padding: 30, textAlign: "center", color: MUTED, fontSize: 13 }}>Nenhuma categoria cadastrada.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", alignSelf: "start" }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {editing ? "Editar categoria" : "Nova categoria"}
            {editing && (
              <button onClick={resetForm} style={{ border: "none", background: "transparent", color: MUTED, fontFamily: "var(--font-mono)", fontSize: 11, cursor: "pointer" }}>cancelar</button>
            )}
          </div>
          <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Nome">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Meio ambiente" style={inputStyle} />
            </Field>
            <Field label="Slug">
              <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="meio-ambiente" style={{ ...inputStyle, fontFamily: "var(--font-mono)" }} />
            </Field>
            <Field label="Descrição">
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} placeholder="Resumo curto para SEO" style={{ ...inputStyle, resize: "none" }} />
            </Field>
            <Field label="Cor">
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ ...inputStyle, height: 42, padding: 4 }} />
            </Field>
            <button
              disabled={saving}
              onClick={handleSubmit}
              style={{
                padding: "10px 16px", background: TEAL, color: "white",
                border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600,
                cursor: saving ? "wait" : "pointer", opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? "Salvando..." : editing ? "Atualizar" : "Criar categoria"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "9px 12px", border: `1px solid ${BORDER}`, borderRadius: 8,
  fontSize: 13, width: "100%", outline: "none", background: BG, color: INK,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED,
        textTransform: "uppercase", letterSpacing: "0.06em",
        display: "block", marginBottom: 6, fontWeight: 600,
      }}>{label}</label>
      {children}
    </div>
  );
}
