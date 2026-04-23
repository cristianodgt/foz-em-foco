"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

const catClass = (c: string) =>
  c.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const STATUS_STYLES: Record<string, { bg: string; fg: string; label: string }> = {
  publicado: { bg: "#e6f9f3", fg: "#047857", label: "PUBLICADO" },
  rascunho:  { bg: "#fef3c7", fg: "#92400e", label: "RASCUNHO" },
  revisao:   { bg: "#e0f2fe", fg: "#075985", label: "REVISAO" },
  agendado:  { bg: "#ede9fe", fg: "#5b21b6", label: "AGENDADO" },
  arquivado: { bg: "#f3f4f6", fg: "#6b7280", label: "ARQUIVADO" },
};

export type ArticleRow = {
  id: string;
  title: string;
  slug: string;
  status: string;
  views: number;
  category: { name: string };
  author: { name: string | null };
};

export default function NoticiasTable({ articles }: { articles: ArticleRow[] }) {
  const router = useRouter();

  return (
    <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", marginBottom: 20 }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: BG }}>
            {["Título", "Categoria", "Autor", "Status", "Views", ""].map((h, i) => (
              <th key={i} style={{
                padding: "10px 14px", fontSize: 11, fontFamily: "var(--font-mono)",
                color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em",
                textAlign: i === 4 ? "right" : "left", fontWeight: 600,
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {articles.map((a, i) => {
            const st = STATUS_STYLES[a.status] ?? { bg: "#f3f4f6", fg: MUTED, label: a.status.toUpperCase() };
            return (
              <tr
                key={a.id}
                onClick={() => router.push(`/admin/noticias/${a.id}`)}
                onMouseEnter={(e) => (e.currentTarget.style.background = BG)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                style={{
                  borderTop: i > 0 ? `1px solid ${BORDER}` : "none",
                  cursor: "pointer",
                  transition: "background 0.12s",
                }}
              >
                <td style={{ padding: "14px", fontSize: 13, color: INK, maxWidth: 420 }}>
                  <div style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {a.title}
                  </div>
                  <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, marginTop: 2 }}>
                    /{a.slug}
                  </div>
                </td>
                <td style={{ padding: "14px" }}>
                  <span className={`cat-tag ${catClass(a.category.name)}`}>{a.category.name}</span>
                </td>
                <td style={{ padding: "14px", fontSize: 13, color: INK }}>{a.author.name ?? "—"}</td>
                <td style={{ padding: "14px" }}>
                  <span style={{
                    fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700,
                    padding: "3px 8px", borderRadius: 99,
                    background: st.bg, color: st.fg,
                  }}>
                    {st.label}
                  </span>
                </td>
                <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 13, color: TEAL, fontWeight: 700, textAlign: "right" }}>
                  {a.views.toLocaleString("pt-BR")}
                </td>
                <td style={{ padding: "14px", textAlign: "right" }}>
                  <Link
                    href={`/admin/noticias/${a.id}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      padding: "6px 12px", background: "white", color: INK,
                      border: `1px solid ${BORDER}`, borderRadius: 6,
                      fontSize: 12, fontWeight: 500, textDecoration: "none",
                      display: "inline-block",
                    }}
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            );
          })}
          {articles.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: "48px 14px", textAlign: "center", color: MUTED, fontSize: 13 }}>
                Nenhum artigo encontrado com este filtro.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
