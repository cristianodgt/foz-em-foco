"use client";

import { useEffect, useState } from "react";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

interface Comment {
  id: string;
  name: string;
  email: string;
  body: string;
  status: string;
  createdAt: string;
  article: { title: string; slug: string; category: { slug: string } };
}

const FILTERS: Array<{ key: string; label: string }> = [
  { key: "pendente", label: "Pendentes" },
  { key: "aprovado", label: "Aprovados" },
  { key: "rejeitado", label: "Rejeitados" },
  { key: "spam", label: "Spam" },
];

const STATUS_STYLES: Record<string, { bg: string; fg: string }> = {
  pendente:  { bg: "#fef3c7", fg: "#92400e" },
  aprovado:  { bg: "#e6f9f3", fg: "#047857" },
  rejeitado: { bg: "#fee2e2", fg: "#b91c1c" },
  spam:      { bg: "#f3f4f6", fg: "#6b7280" },
};

export default function ComentariosPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState("pendente");

  const load = () =>
    fetch(`/api/comments?status=${filter}`)
      .then((r) => r.json())
      .then(setComments)
      .catch(() => {});

  useEffect(() => { load(); }, [filter]);

  const update = async (id: string, status: string) => {
    await fetch(`/api/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setComments((c) => c.filter((x) => x.id !== id));
  };

  const remove = async (id: string) => {
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    setComments((c) => c.filter((x) => x.id !== id));
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      {/* Hero */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>
            Comentários
          </div>
          <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>
            moderação da comunidade · filtro atual: {filter}
          </div>
        </div>
      </div>

      {/* Filtros toolbar */}
      <div style={{
        background: "white", border: `1px solid ${BORDER}`, borderRadius: 10,
        padding: "12px 16px", display: "flex", gap: 8, alignItems: "center", marginBottom: 16,
      }}>
        {FILTERS.map((f) => {
          const active = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: "7px 12px", fontSize: 12, fontFamily: "var(--font-mono)",
                fontWeight: 600, borderRadius: 6, cursor: "pointer",
                border: `1px solid ${active ? TEAL : BORDER}`,
                background: active ? TEAL : "white",
                color: active ? "white" : MUTED,
              }}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Lista */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {comments.map((c) => {
          const st = STATUS_STYLES[c.status] ?? STATUS_STYLES.pendente;
          return (
            <div key={c.id} style={{
              background: "white", border: `1px solid ${BORDER}`, borderRadius: 14,
              padding: "18px 22px",
            }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "#e6f9f3", color: TEAL,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-serif)", fontSize: 15, fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {c.name[0]?.toUpperCase() ?? "?"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: INK }}>{c.name}</span>
                    <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {c.email} · {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                    <span style={{
                      fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700,
                      padding: "3px 8px", borderRadius: 99,
                      background: st.bg, color: st.fg,
                    }}>
                      {c.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, color: INK, lineHeight: 1.5, marginBottom: 8 }}>{c.body}</div>
                  <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    em: {c.article?.title ?? "—"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  {c.status === "pendente" && (
                    <button onClick={() => update(c.id, "aprovado")} style={{
                      padding: "6px 12px", background: TEAL, color: "white",
                      border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    }}>
                      Aprovar
                    </button>
                  )}
                  <button onClick={() => update(c.id, "rejeitado")} style={{
                    padding: "6px 12px", background: "white", color: INK,
                    border: `1px solid ${BORDER}`, borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer",
                  }}>
                    Rejeitar
                  </button>
                  <button onClick={() => remove(c.id)} style={{
                    padding: "6px 12px", background: "transparent", color: "#b91c1c",
                    border: "1px solid #fecaca", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer",
                  }}>
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {comments.length === 0 && (
          <div style={{
            background: "white", border: `1px solid ${BORDER}`, borderRadius: 14,
            padding: "60px 24px", textAlign: "center",
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f3f4f6", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", color: MUTED, fontFamily: "var(--font-serif)", fontSize: 22 }}>
              —
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: INK, marginBottom: 6 }}>
              Nenhum comentário
            </div>
            <div style={{ fontSize: 13, color: MUTED }}>
              Não há comentários com status &quot;{filter}&quot; no momento.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
