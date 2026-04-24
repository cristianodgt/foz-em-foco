"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

export default function NovoAnunciantePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [segment, setSegment] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contact, setContact] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!name) { alert("Nome obrigatório"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/advertisers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, segment, email, phone, contact }),
      });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        alert(e.error ?? "Falha ao salvar");
        return;
      }
      router.push("/admin/anuncios");
    } finally { setSaving(false); }
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20 }}>
        <Link href="/admin/anuncios" style={{ padding: "8px 12px", background: "white", color: INK, border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, textDecoration: "none" }}>← Voltar</Link>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: INK }}>Novo anunciante</div>
      </div>

      <div style={{ maxWidth: 560, background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
        <Field label="Nome"><input value={name} onChange={(e) => setName(e.target.value)} style={input} /></Field>
        <Field label="Segmento"><input value={segment} onChange={(e) => setSegment(e.target.value)} style={input} /></Field>
        <Field label="Contato"><input value={contact} onChange={(e) => setContact(e.target.value)} style={input} /></Field>
        <Field label="E-mail"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} /></Field>
        <Field label="Telefone"><input value={phone} onChange={(e) => setPhone(e.target.value)} style={input} /></Field>
        <button disabled={saving} onClick={handleSubmit}
          style={{ padding: "10px 16px", background: TEAL, color: "white", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: saving ? "wait" : "pointer", opacity: saving ? 0.6 : 1 }}>
          {saving ? "Salvando..." : "Cadastrar"}
        </button>
      </div>
    </div>
  );
}

const input: React.CSSProperties = { padding: "9px 12px", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, width: "100%", outline: "none", background: BG, color: INK };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6, fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}
