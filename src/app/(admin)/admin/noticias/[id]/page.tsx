"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

const BODY_SCAFFOLD = `## Resumo da notícia

Escreva aqui o parágrafo de abertura (lide) com as informações essenciais: **o quê, quem, quando, onde e por quê**. Este é o parágrafo mais importante — ele aparece no destaque e nos compartilhamentos.

## Contexto

Apresente o contexto que levou ao fato.

## O que aconteceu

Descreva os fatos em ordem cronológica.

> "Inclua aqui uma citação relevante."
> — Nome da fonte, cargo

## Desdobramentos

Explique os próximos passos.

- Primeiro ponto
- Segundo ponto
- Terceiro ponto

## Para saber mais

Feche com informações práticas.

---

*Com informações da redação Foz em Foco.*
`;

const STATUS_UI_TO_DB: Record<string, string> = {
  "Rascunho": "rascunho", "Em revisão": "revisao", "Agendado": "agendado", "Publicado": "publicado",
};
const STATUS_DB_TO_UI: Record<string, string> = {
  "rascunho": "Rascunho", "revisao": "Em revisão", "agendado": "Agendado", "publicado": "Publicado",
};

function truncate(s: string, max: number) {
  if (!s) return "";
  if (s.length <= max) return s;
  return s.slice(0, max - 1).trimEnd() + "…";
}

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);
}

const inputStyle: React.CSSProperties = { padding: "9px 12px", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, width: "100%", outline: "none", background: "white", color: INK };
const inputSm: React.CSSProperties = { ...inputStyle, padding: "7px 10px", fontSize: 13 };

type Cat = { id: string; name: string; slug: string };
type Author = { id: string; name: string | null };

export default function ArticleEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const isNew = id === "novo";
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [lead, setLead] = useState("");
  const [body, setBody] = useState(isNew ? BODY_SCAFFOLD : "");
  const [categoryId, setCategoryId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [status, setStatus] = useState("Rascunho");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(isNew);
  const [dbId, setDbId] = useState<string | null>(isNew ? null : id);

  const [categories, setCategories] = useState<Cat[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  const [metaTitleOverride, setMetaTitleOverride] = useState<string | null>(null);
  const [metaDescOverride, setMetaDescOverride] = useState<string | null>(null);
  const [slugOverride, setSlugOverride] = useState<string | null>(null);

  // Load categories + authors
  useEffect(() => {
    (async () => {
      const [cRes, aRes] = await Promise.all([fetch("/api/admin/categories"), fetch("/api/admin/authors")]);
      const cData = await cRes.json().catch(() => ({ items: [] }));
      const aData = await aRes.json().catch(() => ({ items: [] }));
      setCategories(cData.items ?? []);
      setAuthors(aData.items ?? []);
      if (isNew && cData.items?.length) setCategoryId(cData.items[0].id);
    })();
  }, [isNew]);

  // Load existing article
  useEffect(() => {
    if (isNew) return;
    (async () => {
      const res = await fetch(`/api/admin/articles/${id}`);
      if (!res.ok) { setLoaded(true); return; }
      const a = await res.json();
      setTitle(a.title ?? "");
      setLead(a.lead ?? "");
      setBody(a.body ?? "");
      setCategoryId(a.categoryId);
      setAuthorId(a.authorId);
      setStatus(STATUS_DB_TO_UI[a.status] ?? "Rascunho");
      setImageUrl(a.imageUrl ?? "");
      setMetaTitleOverride(a.metaTitle ?? null);
      setMetaDescOverride(a.metaDescription ?? null);
      setSlugOverride(a.slug ?? null);
      setDbId(a.id);
      setLoaded(true);
    })();
  }, [id, isNew]);

  const autoMetaTitle = useMemo(() => {
    const base = title.trim();
    if (!base) return "";
    const suffix = " | Foz em Foco";
    return truncate(base, 60 - suffix.length) + suffix;
  }, [title]);

  const autoMetaDesc = useMemo(() => {
    const source = lead.trim() || body.replace(/[#*>_\-\n]/g, " ").trim();
    return truncate(source, 160);
  }, [lead, body]);

  const autoSlug = useMemo(() => slugify(title), [title]);
  const metaTitle = metaTitleOverride ?? autoMetaTitle;
  const metaDesc = metaDescOverride ?? autoMetaDesc;
  const slug = slugOverride ?? autoSlug;

  const seoScore = {
    title: metaTitle.length >= 30 && metaTitle.length <= 60,
    desc: metaDesc.length >= 70 && metaDesc.length <= 160,
    slug: slug.length > 0 && slug.length <= 75,
  };

  const handleSave = useCallback(async () => {
    if (!title.trim()) { alert("Informe um título"); return; }
    if (!categoryId) { alert("Selecione uma categoria"); return; }
    setSaving(true);
    try {
      const payload: any = {
        title, lead, body, slug, imageUrl: imageUrl || null,
        categoryId, status: STATUS_UI_TO_DB[status] ?? "rascunho",
        metaTitle: metaTitleOverride, metaDescription: metaDescOverride,
      };
      if (authorId) payload.authorId = authorId;

      const url = dbId ? `/api/admin/articles/${dbId}` : "/api/admin/articles";
      const method = dbId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        alert(e.error ?? "Falha ao salvar");
        return;
      }
      const saved = await res.json();
      if (!dbId) {
        router.push(`/admin/noticias/${saved.id}`);
      } else {
        alert("Salvo!");
      }
    } finally { setSaving(false); }
  }, [title, lead, body, slug, imageUrl, categoryId, status, metaTitleOverride, metaDescOverride, authorId, dbId, router]);

  if (!loaded) {
    return <div style={{ padding: 40, color: MUTED, fontFamily: "var(--font-mono)" }}>Carregando...</div>;
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
        <Link href="/admin/noticias" style={{ padding: "8px 12px", background: "white", color: INK, border: `1px solid ${BORDER}`, borderRadius: 8, fontWeight: 500, fontSize: 13, textDecoration: "none" }}>
          ← Voltar
        </Link>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: INK, lineHeight: 1.1 }}>
            {isNew ? "Nova notícia" : "Editar notícia"}
          </div>
          <div style={{ fontSize: 12, color: MUTED, fontFamily: "var(--font-mono)", marginTop: 2 }}>
            {dbId ? `id: ${dbId}` : "rascunho não salvo"}
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            style={{ padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`, borderRadius: 8, background: "white", outline: "none", color: INK }}>
            {["Rascunho", "Em revisão", "Agendado", "Publicado"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <button disabled={saving} onClick={handleSave}
            style={{ padding: "9px 16px", background: TEAL, color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: saving ? "wait" : "pointer", fontSize: 13, opacity: saving ? 0.6 : 1 }}>
            {saving ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "22px 24px" }}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título da notícia..."
              style={{ width: "100%", border: "none", outline: "none", fontFamily: "var(--font-serif)", fontSize: 28, lineHeight: 1.2, background: "transparent", color: INK }} />
            <div style={{ height: 1, background: BORDER, margin: "14px 0" }} />
            <input value={lead} onChange={(e) => setLead(e.target.value)} placeholder="Lead / subtítulo..."
              style={{ width: "100%", border: "none", outline: "none", fontSize: 16, color: "#444", fontStyle: "italic", background: "transparent" }} />
          </div>

          <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: `1px solid ${BORDER}`, background: BG, display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: MUTED, letterSpacing: "0.06em", textTransform: "uppercase" }}>corpo da notícia (markdown)</span>
              <div style={{ marginLeft: "auto" }}>
                <button onClick={() => setBody(BODY_SCAFFOLD)}
                  style={{ padding: "5px 10px", border: `1px solid ${BORDER}`, borderRadius: 6, background: "white", fontSize: 11, cursor: "pointer", color: MUTED, fontFamily: "var(--font-mono)", fontWeight: 600 }}>
                  Restaurar modelo
                </button>
              </div>
            </div>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Escreva o corpo..."
              style={{ width: "100%", minHeight: 460, padding: "22px 24px", border: "none", outline: "none", resize: "vertical", fontFamily: "Georgia,serif", fontSize: 16, lineHeight: 1.8, color: "#333", background: "transparent" }} />
            <div style={{ padding: "8px 16px", borderTop: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED }}>
              <span>{body.trim().split(/\s+/).filter(Boolean).length} palavras</span>
              <span>~{Math.max(1, Math.ceil(body.trim().split(/\s+/).filter(Boolean).length / 220))} min de leitura</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card title="Publicação">
            <Row label="Status">
              <select value={status} onChange={(e) => setStatus(e.target.value)} style={inputSm}>
                {["Rascunho", "Em revisão", "Agendado", "Publicado"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </Row>
            <Row label="Autor">
              <select value={authorId} onChange={(e) => setAuthorId(e.target.value)} style={inputSm}>
                <option value="">(eu)</option>
                {authors.map((a) => <option key={a.id} value={a.id}>{a.name ?? a.id}</option>)}
              </select>
            </Row>
          </Card>

          <Card title="Categoria">
            <Row label="Categoria">
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={inputSm}>
                <option value="">—</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Row>
          </Card>

          <Card title="Imagem de destaque">
            <Row label="URL da imagem">
              <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="/uploads/..." style={inputSm} />
            </Row>
            {imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="preview" style={{ width: "100%", borderRadius: 8, border: `1px solid ${BORDER}` }} />
            )}
          </Card>

          <Card title="SEO">
            <Row label={`Slug · /${slug || "—"}`}>
              <input value={slug} onChange={(e) => setSlugOverride(slugify(e.target.value))} style={inputSm} />
            </Row>
            <Row label={`Meta título · ${metaTitle.length}/60`}>
              <input value={metaTitle} onChange={(e) => setMetaTitleOverride(e.target.value)} style={inputSm} />
            </Row>
            <Row label={`Meta descrição · ${metaDesc.length}/160`}>
              <textarea value={metaDesc} onChange={(e) => setMetaDescOverride(e.target.value)} rows={3}
                style={{ ...inputSm, resize: "none", minHeight: 72, fontFamily: "inherit" }} />
            </Row>
            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
              <SeoCheck ok={seoScore.title} label="Meta título 30-60" />
              <SeoCheck ok={seoScore.desc} label="Meta descrição 70-160" />
              <SeoCheck ok={seoScore.slug} label="Slug válido" />
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
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700, color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", background: BG }}>
        {title}
      </div>
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5, fontWeight: 600 }}>{label}</label>
      {children}
    </div>
  );
}
function SeoCheck({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontFamily: "var(--font-mono)", color: ok ? "#047857" : "#92400e" }}>
      <span style={{ fontWeight: 700 }}>{ok ? "✓" : "!"}</span>
      <span>{label}</span>
    </div>
  );
}
