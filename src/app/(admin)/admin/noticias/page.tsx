import { prisma } from "@/lib/prisma";
import Link from "next/link";
import NoticiasTable, { type ArticleRow } from "./NoticiasTable";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

interface Props {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function NoticiasPage({ searchParams }: Props) {
  const { status, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10));
  const PER_PAGE = 20;

  const where = status ? { status: status as any } : {};
  const [articles, total, publicados, rascunhos, revisao] = await Promise.all([
    prisma.article.findMany({
      where,
      include: { category: true, author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.article.count({ where }),
    prisma.article.count({ where: { status: "publicado" as any } }),
    prisma.article.count({ where: { status: "rascunho" as any } }),
    prisma.article.count({ where: { status: "revisao" as any } }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);
  const filters: Array<{ key: string; label: string }> = [
    { key: "", label: "Todos" },
    { key: "publicado", label: "Publicados" },
    { key: "rascunho", label: "Rascunhos" },
    { key: "revisao", label: "Em revisão" },
    { key: "agendado", label: "Agendados" },
  ];

  const totalGeral = await prisma.article.count();

  const kpis = [
    { label: "Total de artigos", value: totalGeral.toLocaleString("pt-BR"), color: TEAL },
    { label: "Publicados", value: publicados.toLocaleString("pt-BR"), color: "#047857" },
    { label: "Rascunhos", value: rascunhos.toLocaleString("pt-BR"), color: "#92400e" },
    { label: "Em revisão", value: revisao.toLocaleString("pt-BR"), color: "#075985" },
  ];

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      {/* Hero */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>
            Notícias
          </div>
          <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>
            {total.toLocaleString("pt-BR")} artigos {status ? `· filtro: ${status}` : "· todos os status"}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/admin/noticias?status=rascunho" style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 14px",
            border: `1px solid ${BORDER}`, borderRadius: 8, background: "white",
            fontSize: 13, color: INK, textDecoration: "none", fontWeight: 500,
          }}>
            Ver rascunhos
          </Link>
          <Link href="/admin/noticias/novo" style={{
            display: "flex", alignItems: "center", gap: 6, padding: "9px 16px",
            background: TEAL, borderRadius: 8, fontSize: 13, color: "white",
            textDecoration: "none", fontWeight: 600,
          }}>
            + Nova notícia
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{
            background: "white", border: `1px solid ${BORDER}`, borderRadius: 14,
            padding: "18px 20px", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: k.color }} />
            <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 10 }}>{k.label}</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 30, lineHeight: 1, color: INK }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Toolbar / filtros */}
      <div style={{
        background: "white", border: `1px solid ${BORDER}`, borderRadius: 10,
        padding: "12px 16px", display: "flex", gap: 10, alignItems: "center",
        marginBottom: 16, flexWrap: "wrap",
      }}>
        <input
          placeholder="Buscar por título ou slug..."
          style={{
            flex: 1, minWidth: 220, padding: "9px 12px", fontSize: 13,
            border: `1px solid ${BORDER}`, borderRadius: 8, outline: "none",
            background: BG, color: INK,
          }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {filters.map((f) => {
            const active = (f.key === "" && !status) || status === f.key;
            return (
              <Link
                key={f.key || "all"}
                href={f.key ? `?status=${f.key}` : "/admin/noticias"}
                style={{
                  padding: "7px 12px", fontSize: 12, fontFamily: "var(--font-mono)",
                  fontWeight: 600, borderRadius: 6, textDecoration: "none",
                  border: `1px solid ${active ? TEAL : BORDER}`,
                  background: active ? TEAL : "white",
                  color: active ? "white" : MUTED,
                }}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tabela */}
      <NoticiasTable articles={articles as ArticleRow[]} />

      {/* Paginação */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
            const active = p === page;
            return (
              <a
                key={p}
                href={`?${status ? `status=${status}&` : ""}page=${p}`}
                style={{
                  width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center",
                  borderRadius: 8, fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 600,
                  border: `1px solid ${active ? TEAL : BORDER}`,
                  background: active ? TEAL : "white",
                  color: active ? "white" : MUTED,
                  textDecoration: "none",
                }}
              >
                {p}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
