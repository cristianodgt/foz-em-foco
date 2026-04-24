"use client";

import React, { useCallback, useEffect, useState } from "react";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

type Business = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  plan: string;
  active: boolean;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  bairro: string | null;
  city: string;
  categoryId: string;
  category?: { id: string; name: string };
  _count?: { reviews: number; photos: number };
};

type Cat = { id: string; name: string; slug?: string; icon?: string | null; _count?: { businesses: number } };

export default function GuiaPage() {
  const [items, setItems] = useState<Business[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [editing, setEditing] = useState<Business | null>(null);
  const [form, setForm] = useState({ name: "", description: "", plan: "basico", phone: "", whatsapp: "", email: "", website: "", address: "", bairro: "", categoryId: "" });
  const [saving, setSaving] = useState(false);

  // BusinessCategory management state
  const [catEditing, setCatEditing] = useState<Cat | null>(null);
  const [catForm, setCatForm] = useState({ name: "", slug: "", icon: "" });
  const [catSaving, setCatSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/businesses");
    const data = await res.json();
    setItems(data.items ?? []);
  }, []);

  const loadCats = useCallback(async () => {
    const res = await fetch("/api/admin/business-categories");
    if (!res.ok) { setCats([]); return; }
    const data = await res.json();
    setCats(data.items ?? []);
  }, []);

  useEffect(() => {
    load();
    loadCats();
  }, [load, loadCats]);

  function resetCatForm() {
    setCatEditing(null);
    setCatForm({ name: "", slug: "", icon: "" });
  }

  function startEditCat(c: Cat) {
    setCatEditing(c);
    setCatForm({ name: c.name, slug: c.slug ?? "", icon: c.icon ?? "" });
  }

  async function handleSubmitCat() {
    if (!catForm.name) { alert("Nome obrigatório"); return; }
    setCatSaving(true);
    try {
      const url = catEditing ? `/api/admin/business-categories/${catEditing.id}` : "/api/admin/business-categories";
      const method = catEditing ? "PATCH" : "POST";
      const payload: Record<string, unknown> = { name: catForm.name, icon: catForm.icon || null };
      if (catForm.slug) payload.slug = catForm.slug;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        alert(e.error ?? "Falha ao salvar categoria");
        return;
      }
      resetCatForm();
      await loadCats();
    } finally { setCatSaving(false); }
  }

  async function handleDeleteCat(c: Cat) {
    if (!confirm(`Excluir categoria "${c.name}"?`)) return;
    const res = await fetch(`/api/admin/business-categories/${c.id}`, { method: "DELETE" });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      alert(e.error ?? "Falha ao excluir");
      return;
    }
    if (catEditing?.id === c.id) resetCatForm();
    await loadCats();
  }

  function resetForm() {
    setEditing(null);
    setForm({ name: "", description: "", plan: "basico", phone: "", whatsapp: "", email: "", website: "", address: "", bairro: "", categoryId: cats[0]?.id ?? "" });
  }

  function startEdit(b: Business) {
    setEditing(b);
    setForm({
      name: b.name, description: b.description ?? "", plan: b.plan,
      phone: b.phone ?? "", whatsapp: b.whatsapp ?? "", email: b.email ?? "",
      website: b.website ?? "", address: b.address ?? "", bairro: b.bairro ?? "",
      categoryId: b.categoryId,
    });
  }

  async function handleSubmit() {
    if (!form.name) { alert("Nome obrigatório"); return; }
    if (!form.categoryId) { alert("Selecione uma categoria (ou cadastre uma via seed/API)"); return; }
    setSaving(true);
    try {
      const url = editing ? `/api/admin/businesses/${editing.id}` : "/api/admin/businesses";
      const method = editing ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        alert(e.error ?? "Falha ao salvar");
        return;
      }
      resetForm();
      await load();
    } finally { setSaving(false); }
  }

  async function handleDelete(b: Business) {
    if (!confirm(`Excluir "${b.name}"?`)) return;
    const res = await fetch(`/api/admin/businesses/${b.id}`, { method: "DELETE" });
    if (!res.ok) { alert("Falha ao excluir"); return; }
    if (editing?.id === b.id) resetForm();
    await load();
  }

  async function toggleActive(b: Business) {
    const res = await fetch(`/api/admin/businesses/${b.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !b.active }) });
    if (res.ok) await load();
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>Guia Comercial</div>
          <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>{items.length} estabelecimentos</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>Negócios</div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: BG }}>
              {["Nome", "Categoria", "Plano", "Ativo", ""].map((h, i) => (
                <th key={i} style={{ padding: "10px 14px", fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", fontWeight: 600 }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {items.map((b, i) => (
                <tr key={b.id} style={{ borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                  <td style={{ padding: "14px", fontSize: 13, color: INK, fontWeight: 500 }}>{b.name}</td>
                  <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>{b.category?.name ?? "—"}</td>
                  <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 11, color: TEAL, textTransform: "uppercase", fontWeight: 700 }}>{b.plan}</td>
                  <td style={{ padding: "14px" }}>
                    <button onClick={() => toggleActive(b)} style={{ padding: "3px 8px", border: "none", borderRadius: 99, background: b.active ? "#e6f9f3" : "#f3f4f6", color: b.active ? "#047857" : MUTED, fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700, cursor: "pointer" }}>
                      {b.active ? "ATIVO" : "INATIVO"}
                    </button>
                  </td>
                  <td style={{ padding: "14px", textAlign: "right", whiteSpace: "nowrap" }}>
                    <button onClick={() => startEdit(b)} style={btn}>Editar</button>{" "}
                    <button onClick={() => handleDelete(b)} style={btnDanger}>Excluir</button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={5} style={{ padding: 30, textAlign: "center", color: MUTED, fontSize: 13 }}>Nenhum estabelecimento cadastrado.</td></tr>}
            </tbody>
          </table>
        </div>

        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", alignSelf: "start" }}>
          <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK, display: "flex", justifyContent: "space-between" }}>
            {editing ? "Editar negócio" : "Novo negócio"}
            {editing && <button onClick={resetForm} style={linkBtn}>cancelar</button>}
          </div>
          <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Nome"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={input} /></Field>
            <Field label="Categoria">
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} style={input}>
                <option value="">— Selecione —</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              {cats.length === 0 && <div style={{ fontSize: 11, color: MUTED, marginTop: 4, fontFamily: "var(--font-mono)" }}>Nenhuma categoria. Cadastre uma na seção abaixo.</div>}
            </Field>
            <Field label="Descrição"><textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ ...input, resize: "none" }} /></Field>
            <Field label="Plano">
              <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} style={input}>
                <option value="basico">Básico</option><option value="prata">Prata</option><option value="ouro">Ouro</option>
              </select>
            </Field>
            <Field label="Telefone"><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} style={input} /></Field>
            <Field label="WhatsApp"><input value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} style={input} /></Field>
            <Field label="E-mail"><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={input} /></Field>
            <Field label="Website"><input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} style={input} /></Field>
            <Field label="Endereço"><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} style={input} /></Field>
            <Field label="Bairro"><input value={form.bairro} onChange={(e) => setForm({ ...form, bairro: e.target.value })} style={input} /></Field>
            <button disabled={saving} onClick={handleSubmit}
              style={{ padding: "10px 16px", background: TEAL, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: saving ? "wait" : "pointer", opacity: saving ? 0.6 : 1 }}>
              {saving ? "Salvando..." : editing ? "Atualizar" : "Criar negócio"}
            </button>
          </div>
        </div>
      </div>

      {/* BusinessCategory management */}
      <div style={{ marginTop: 28 }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, color: INK, lineHeight: 1.1, marginBottom: 4 }}>Categorias do Guia</div>
          <div style={{ fontSize: 12, color: MUTED, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{cats.length} categorias</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 20 }}>
          <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK }}>Categorias</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: BG }}>
                {["Nome", "Slug", "Ícone", "Negócios", ""].map((h, i) => (
                  <th key={i} style={{ padding: "10px 14px", fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", fontWeight: 600 }}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {cats.map((c, i) => (
                  <tr key={c.id} style={{ borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                    <td style={{ padding: "14px", fontSize: 13, color: INK, fontWeight: 500 }}>{c.name}</td>
                    <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>{c.slug ?? "—"}</td>
                    <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>{c.icon ?? "—"}</td>
                    <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 11, color: TEAL, fontWeight: 700 }}>{c._count?.businesses ?? 0}</td>
                    <td style={{ padding: "14px", textAlign: "right", whiteSpace: "nowrap" }}>
                      <button onClick={() => startEditCat(c)} style={btn}>Editar</button>{" "}
                      <button onClick={() => handleDeleteCat(c)} style={btnDanger}>Excluir</button>
                    </td>
                  </tr>
                ))}
                {cats.length === 0 && <tr><td colSpan={5} style={{ padding: 30, textAlign: "center", color: MUTED, fontSize: 13 }}>Nenhuma categoria cadastrada.</td></tr>}
              </tbody>
            </table>
          </div>

          <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", alignSelf: "start" }}>
            <div style={{ padding: "16px 22px", borderBottom: `1px solid ${BORDER}`, fontFamily: "var(--font-serif)", fontSize: 16, color: INK, display: "flex", justifyContent: "space-between" }}>
              {catEditing ? "Editar categoria" : "Nova categoria"}
              {catEditing && <button onClick={resetCatForm} style={linkBtn}>cancelar</button>}
            </div>
            <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
              <Field label="Nome"><input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} style={input} /></Field>
              <Field label="Slug (opcional)"><input value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} placeholder="auto a partir do nome" style={input} /></Field>
              <Field label="Ícone (opcional)"><input value={catForm.icon} onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })} placeholder="ex: utensils" style={input} /></Field>
              <button disabled={catSaving} onClick={handleSubmitCat}
                style={{ padding: "10px 16px", background: TEAL, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: catSaving ? "wait" : "pointer", opacity: catSaving ? 0.6 : 1 }}>
                {catSaving ? "Salvando..." : catEditing ? "Atualizar" : "Criar categoria"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const input: React.CSSProperties = { padding: "9px 12px", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, width: "100%", outline: "none", background: BG, color: INK };
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
