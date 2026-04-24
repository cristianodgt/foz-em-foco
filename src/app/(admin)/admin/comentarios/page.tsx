"use client";

import React, { useCallback, useEffect, useState } from "react";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

type Comment = {
  id: string;
  name: string;
  email: string;
  body: string;
  status: string;
  createdAt: string;
  article: { id: string; title: string; slug: string } | null;
};

const TABS = [
  { key: "pendente", label: "Pendentes" },
  { key: "aprovado", label: "Aprovados" },
  { key: "rejeitado", label: "Rejeitados" },
  { key: "spam", label: "Spam" },
];

export default function ComentariosPage() {
  const [status, setStatus] = useState("pendente");
  const [items, setItems] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/comments?status=${status}`);
      const data = await res.json();
      setItems(data.items ?? []);
    } finally { setLoading(false); }
  }, [status]);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id: string, newStatus: string) {
    const res = await fetch(`/api/admin/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) { alert("Falha ao atualizar"); return; }
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir comentário?")) return;
    const res = await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
    if (!res.ok) { alert("Falha ao excluir"); return; }
    await load();
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>
          Moderação de comentários
        </div>
        <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>
          {items.length} {status}{items.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setStatus(t.key)}
            style={{
              padding: "8px 14px", border: `1px solid ${BORDER}`,
              borderRadius: 8, background: status === t.key ? TEAL : "white",
              color: status === t.key ? "white" : INK, fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <div style={{ color: MUTED, fontFamily: "var(--font-mono)", fontSize: 12 }}>Carregando...</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map((c) => (
          <div key={c.id} style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "16px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8, gap: 12 }}>
              <div>
                <div style={{ fontSize: 14, color: INK, fontWeight: 600 }}>{c.name} <span style={{ color: MUTED, fontWeight: 400, fontSize: 12, fontFamily: "var(--font-mono)" }}>· {c.email}</span></div>
                {c.article && (
                  <div style={{ fontSize: 11, color: MUTED, fontFamily: "var(--font-mono)", marginTop: 3 }}>
                    em: {c.article.title}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 11, color: MUTED, fontFamily: "var(--font-mono)" }}>
                {new Date(c.createdAt).toLocaleString("pt-BR")}
              </div>
            </div>
            <div style={{ fontSize: 13, color: INK, lineHeight: 1.5, marginBottom: 12 }}>{c.body}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {status !== "aprovado" && <button onClick={() => updateStatus(c.id, "aprovado")} style={{ ...btn, color: TEAL, borderColor: TEAL }}>Aprovar</button>}
              {status !== "rejeitado" && <button onClick={() => updateStatus(c.id, "rejeitado")} style={btn}>Rejeitar</button>}
              {status !== "spam" && <button onClick={() => updateStatus(c.id, "spam")} style={btn}>Marcar spam</button>}
              {status !== "pendente" && <button onClick={() => updateStatus(c.id, "pendente")} style={btn}>Repender</button>}
              <button onClick={() => handleDelete(c.id)} style={{ ...btn, color: "#c0392b" }}>Excluir</button>
            </div>
          </div>
        ))}
        {items.length === 0 && !loading && (
          <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 40, textAlign: "center", color: MUTED, fontSize: 13 }}>
            Nenhum comentário nesta categoria.
          </div>
        )}
      </div>
    </div>
  );
}

const btn: React.CSSProperties = {
  padding: "6px 12px", background: "white", color: INK,
  border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
};
