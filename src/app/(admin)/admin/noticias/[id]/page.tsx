"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

const EDITORIAS: Record<string, { label: string }> = {
  cidade: { label: "Cidade" },
  politica: { label: "Política" },
  economia: { label: "Economia" },
  turismo: { label: "Turismo" },
  paraguai: { label: "Paraguai" },
  cultura: { label: "Cultura" },
  esporte: { label: "Esporte" },
  itaipu: { label: "Itaipu" },
  seguranca: { label: "Segurança" },
};

const BODY_SCAFFOLD = `## Resumo da notícia

Escreva aqui o parágrafo de abertura (lide) com as informações essenciais: **o quê, quem, quando, onde e por quê**. Este é o parágrafo mais importante — ele aparece no destaque e nos compartilhamentos.

## Contexto

Apresente o contexto que levou ao fato. Explique por que a notícia é relevante para o leitor de Foz do Iguaçu e da tríplice fronteira. Use dados, números e referências confiáveis.

## O que aconteceu

Descreva os fatos em ordem cronológica ou por importância. Mantenha frases curtas e diretas. Cada parágrafo deve conter uma ideia principal.

> "Inclua aqui uma citação relevante de fonte oficial, especialista ou envolvido na história."
> — Nome da fonte, cargo

## Desdobramentos

Explique os próximos passos, impactos e reações. Se houver dados, utilize listas:

- Primeiro ponto relevante
- Segundo ponto relevante
- Terceiro ponto relevante

## O que dizem os envolvidos

Apresente as versões dos lados envolvidos. Equilibre as vozes sempre que possível para manter a imparcialidade.

## Para saber mais

Feche com informações práticas, links úteis ou orientações ao leitor. Indique fontes oficiais e canais de atendimento quando pertinente.

---

*Com informações da redação Foz em Foco.*
`;

function truncate(s: string, max: number) {
  if (!s) return "";
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

const inputStyle: React.CSSProperties = {
  padding: "9px 12px",
  border: `1px solid ${BORDER}`,
  borderRadius: 8,
  fontSize: 13,
  width: "100%",
  outline: "none",
  background: "white",
  color: INK,
};
const inputSm: React.CSSProperties = { ...inputStyle, padding: "7px 10px", fontSize: 13 };

export default function ArticleEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const isNew = id === "novo";

  const [title, setTitle] = useState(isNew ? "" : "Exemplo de título da notícia");
  const [lead, setLead] = useState(
    isNew ? "" : "Resumo curto da notícia que aparece no destaque da home.",
  );
  const [body, setBody] = useState(
    isNew ? BODY_SCAFFOLD : "A Prefeitura de Foz do Iguaçu divulgou nesta segunda-feira...",
  );
  const [category, setCategory] = useState("cidade");
  const [status, setStatus] = useState("Rascunho");
  const [tags, setTags] = useState("");

  // SEO — auto-filled, user pode sobrescrever
  const [metaTitleOverride, setMetaTitleOverride] = useState<string | null>(null);
  const [metaDescOverride, setMetaDescOverride] = useState<string | null>(null);
  const [slugOverride, setSlugOverride] = useState<string | null>(null);

  const categoryLabel = EDITORIAS[category]?.label ?? "";
  const autoMetaTitle = useMemo(() => {
    const base = title.trim();
    if (!base) return "";
    const suffix = " | Foz em Foco";
    const maxBase = 60 - suffix.length;
    return truncate(base, maxBase) + suffix;
  }, [title]);

  const autoMetaDesc = useMemo(() => {
    const source = lead.trim() || body.replace(/[#*>_\-\n]/g, " ").trim();
    if (!source) return "";
    const prefix = categoryLabel ? `${categoryLabel} — ` : "";
    return truncate(prefix + source, 160);
  }, [lead, body, categoryLabel]);

  const autoSlug = useMemo(() => slugify(title), [title]);

  const metaTitle = metaTitleOverride ?? autoMetaTitle;
  const metaDesc = metaDescOverride ?? autoMetaDesc;
  const slug = slugOverride ?? autoSlug;

  const seoScore = {
    title: metaTitle.length >= 30 && metaTitle.length <= 60,
    desc: metaDesc.length >= 70 && metaDesc.length <= 160,
    slug: slug.length > 0 && slug.length <= 75,
  };

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      {/* Hero */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
        <Link
          href="/admin/noticias"
          style={{
            padding: "8px 12px",
            background: "white",
            color: INK,
            border: `1px solid ${BORDER}`,
            borderRadius: 8,
            fontWeight: 500,
            fontSize: 13,
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          ← Voltar
        </Link>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: INK, lineHeight: 1.1 }}>
            {isNew ? "Nova notícia" : "Editar notícia"}
          </div>
          <div style={{ fontSize: 12, color: MUTED, fontFamily: "var(--font-mono)", marginTop: 2 }}>
            {isNew ? "rascunho não salvo" : `id: ${id}`}
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button
            style={{
              padding: "9px 14px",
              background: "white",
              color: INK,
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              fontWeight: 500,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Pré-visualizar
          </button>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{
              padding: "9px 12px",
              fontSize: 13,
              border: `1px solid ${BORDER}`,
              borderRadius: 8,
              background: "white",
              outline: "none",
              color: INK,
            }}
          >
            {["Rascunho", "Em revisão", "Agendado", "Publicado"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button
            style={{
              padding: "9px 16px",
              background: TEAL,
              color: "white",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Salvar
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
        {/* Main */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "22px 24px" }}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título da notícia..."
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontFamily: "var(--font-serif)",
                fontSize: 28,
                lineHeight: 1.2,
                background: "transparent",
                color: INK,
              }}
            />
            <div style={{ height: 1, background: BORDER, margin: "14px 0" }} />
            <input
              value={lead}
              onChange={(e) => setLead(e.target.value)}
              placeholder="Lead / subtítulo (aparece no destaque da home)..."
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                fontSize: 16,
                color: "#444",
                fontStyle: "italic",
                background: "transparent",
              }}
            />
          </div>

          <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
            <div
              style={{
                padding: "10px 16px",
                borderBottom: `1px solid ${BORDER}`,
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                background: BG,
              }}
            >
              {["B", "I", "H2", "H3", "Link", "Imagem", "Bloco", "Lista"].map((l) => (
                <button
                  key={l}
                  style={{
                    padding: "5px 10px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 6,
                    background: "white",
                    fontSize: 12,
                    cursor: "pointer",
                    color: INK,
                    fontWeight: l === "B" ? 700 : 500,
                    fontStyle: l === "I" ? "italic" : "normal",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {l}
                </button>
              ))}
              <div style={{ marginLeft: "auto", display: "flex", gap: 6, alignItems: "center" }}>
                {isNew && body === BODY_SCAFFOLD && (
                  <span
                    style={{
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                      color: TEAL,
                      fontWeight: 600,
                    }}
                  >
                    MODELO PRÉ-CARREGADO
                  </span>
                )}
                <button
                  onClick={() => setBody(BODY_SCAFFOLD)}
                  style={{
                    padding: "5px 10px",
                    border: `1px solid ${BORDER}`,
                    borderRadius: 6,
                    background: "white",
                    fontSize: 11,
                    cursor: "pointer",
                    color: MUTED,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 600,
                  }}
                >
                  Restaurar modelo
                </button>
              </div>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Escreva o corpo da notícia aqui..."
              style={{
                width: "100%",
                minHeight: 460,
                padding: "22px 24px",
                border: "none",
                outline: "none",
                resize: "vertical",
                fontFamily: "Georgia,serif",
                fontSize: 16,
                lineHeight: 1.8,
                color: "#333",
                background: "transparent",
              }}
            />
            <div
              style={{
                padding: "8px 16px",
                borderTop: `1px solid ${BORDER}`,
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                color: MUTED,
              }}
            >
              <span>{body.trim().split(/\s+/).filter(Boolean).length} palavras</span>
              <span>~{Math.max(1, Math.ceil(body.trim().split(/\s+/).filter(Boolean).length / 220))} min de leitura</span>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card title="Publicação">
            <Row label="Status">
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputSm}>
                {["Rascunho", "Em revisão", "Agendado", "Publicado"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Row>
            <Row label="Autor">
              <select style={inputSm}>
                <option>Mariana Souza</option>
                <option>Carlos Lima</option>
                <option>Ana Ferreira</option>
              </select>
            </Row>
            <Row label="Data e hora">
              <input type="datetime-local" style={inputSm} />
            </Row>
          </Card>

          <Card title="Categoria & Tags">
            <Row label="Categoria">
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputSm}>
                {Object.entries(EDITORIAS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </Row>
            <Row label="Tags">
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="separadas por vírgula"
                style={inputSm}
              />
            </Row>
          </Card>

          <Card title="Imagem de destaque">
            <div
              style={{
                border: `2px dashed ${BORDER}`,
                borderRadius: 10,
                padding: "22px",
                textAlign: "center",
                cursor: "pointer",
                background: BG,
              }}
            >
              <div style={{ fontSize: 22, color: MUTED }}>↑</div>
              <div style={{ fontSize: 13, marginTop: 8, color: INK, fontWeight: 500 }}>Upload ou arraste</div>
              <div style={{ fontSize: 11, color: MUTED, marginTop: 4, fontFamily: "var(--font-mono)" }}>
                JPG, PNG, WebP · máx 5MB
              </div>
            </div>
          </Card>

          <Card title="SEO">
            <div
              style={{
                padding: "8px 10px",
                background: "#f2faf9",
                border: `1px solid #cfe9e4`,
                borderRadius: 6,
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                color: TEAL,
                marginBottom: 4,
              }}
            >
              Auto-preenchido a partir do título, lide e categoria. Edite para sobrescrever.
            </div>

            <Row label={`Slug · /${slug || "—"}`}>
              <input
                value={slug}
                onChange={(e) => setSlugOverride(slugify(e.target.value))}
                placeholder="slug-da-noticia"
                style={inputSm}
              />
            </Row>

            <Row label={`Meta título · ${metaTitle.length}/60`}>
              <input
                value={metaTitle}
                onChange={(e) => setMetaTitleOverride(e.target.value)}
                placeholder="Preenchido automaticamente"
                style={inputSm}
              />
            </Row>

            <Row label={`Meta descrição · ${metaDesc.length}/160`}>
              <textarea
                value={metaDesc}
                onChange={(e) => setMetaDescOverride(e.target.value)}
                placeholder="Preenchido automaticamente"
                style={{ ...inputSm, resize: "none", minHeight: 72, fontFamily: "inherit" }}
                rows={3}
              />
            </Row>

            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
              <SeoCheck ok={seoScore.title} label="Meta título entre 30 e 60 caracteres" />
              <SeoCheck ok={seoScore.desc} label="Meta descrição entre 70 e 160 caracteres" />
              <SeoCheck ok={seoScore.slug} label="Slug gerado e válido" />
            </div>

            {(metaTitleOverride !== null || metaDescOverride !== null || slugOverride !== null) && (
              <button
                onClick={() => {
                  setMetaTitleOverride(null);
                  setMetaDescOverride(null);
                  setSlugOverride(null);
                }}
                style={{
                  marginTop: 6,
                  padding: "6px 10px",
                  background: "transparent",
                  color: TEAL,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 6,
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ↻ Restaurar auto-preenchimento
              </button>
            )}

            {/* Preview Google */}
            <div
              style={{
                marginTop: 10,
                padding: "10px 12px",
                border: `1px solid ${BORDER}`,
                borderRadius: 8,
                background: "white",
              }}
            >
              <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: MUTED, marginBottom: 4 }}>
                PREVIEW GOOGLE
              </div>
              <div style={{ fontSize: 12, color: "#1a0dab", lineHeight: 1.3, marginBottom: 2 }}>
                {metaTitle || "Título da notícia | Foz em Foco"}
              </div>
              <div style={{ fontSize: 11, color: "#006621", lineHeight: 1.3, marginBottom: 3 }}>
                fozemfoco.com.br › {category} › {slug || "slug-da-noticia"}
              </div>
              <div style={{ fontSize: 11, color: "#4d5156", lineHeight: 1.4 }}>
                {metaDesc || "Descrição da notícia aparecerá aqui."}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
      <div
        style={{
          padding: "12px 16px",
          borderBottom: `1px solid ${BORDER}`,
          fontSize: 11,
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          color: MUTED,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          background: BG,
        }}
      >
        {title}
      </div>
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        style={{
          fontSize: 10,
          fontFamily: "var(--font-mono)",
          color: MUTED,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          display: "block",
          marginBottom: 5,
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function SeoCheck({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        fontFamily: "var(--font-mono)",
        color: ok ? "#047857" : "#92400e",
      }}
    >
      <span style={{ fontWeight: 700 }}>{ok ? "✓" : "!"}</span>
      <span>{label}</span>
    </div>
  );
}
