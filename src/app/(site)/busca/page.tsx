"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

const FILTERS = [
  ["Tudo", 324], ["Notícias", 187], ["Negócios", 42],
  ["Eventos", 8], ["Vagas", 3], ["Arquivo", 60],
] as [string, number][];

const MOCK_RESULTS = [
  { type: "Notícia",  title: "Prefeitura anuncia R$ 12 mi para revitalização do Centro",   cat: "Cidade",   time: "há 2h",   slug: "cidade/prefeitura-12-mi" },
  { type: "Notícia",  title: "Câmara aprova novo Plano Diretor com foco em mobilidade",     cat: "Política", time: "há 5h",   slug: "politica/plano-diretor" },
  { type: "Negócio",  title: "Rafain Churrascaria — Vila Yolanda · 4.8★",                  cat: "Guia",     time: "Atualizado", slug: "guia/restaurantes/rafain" },
  { type: "Notícia",  title: "Cataratas batem recorde de visitantes em abril",               cat: "Turismo",  time: "há 1d",   slug: "turismo/cataratas-recorde" },
  { type: "Evento",   title: "Festival Gastronômico da Vila A — 21 abr · Gramadão",          cat: "Cultura",  time: "21 abr",  slug: "agenda/festival-gastronomico" },
  { type: "Vaga",     title: "Atendente de Recepção — Hotel Bourbon · CLT R$2.500",          cat: "Empregos", time: "2 dias",  slug: "empregos/atendente-bourbon" },
  { type: "Notícia",  title: "Câmbio favorece varejo: fluxo de turistas argentinos sobe 60%", cat: "Economia", time: "há 1d",  slug: "economia/cambio-turistas" },
  { type: "Notícia",  title: "Novo voo direto para Montevidéu pelo aeroporto IGU",            cat: "Turismo",  time: "há 2d",  slug: "turismo/voo-montevideu" },
];

const TYPE_COLORS: Record<string, string> = {
  Notícia: "cidade", Negócio: "economia", Evento: "cultura", Vaga: "turismo",
};

function BuscaContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(q);
  const [activeFilter, setActiveFilter] = useState("Tudo");

  useEffect(() => { setQuery(q); }, [q]);

  const results = MOCK_RESULTS.filter(r =>
    activeFilter === "Tudo" ||
    (activeFilter === "Notícias" && r.type === "Notícia") ||
    (activeFilter === "Negócios" && r.type === "Negócio") ||
    (activeFilter === "Eventos"  && r.type === "Evento") ||
    (activeFilter === "Vagas"    && r.type === "Vaga")
  );

  return (
    <>
      {/* Search header */}
      <div style={{ background: "var(--paper-2)", borderBottom: "1px solid var(--border)", padding: "28px 0" }}>
        <div className="container">
          <div style={{ maxWidth: 700 }}>
            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8, fontFamily: "var(--font-mono)" }}>
              {query ? `Resultados para "${query}"` : "Busca unificada — Foz em Foco"}
            </div>
            <form method="GET" action="/busca" style={{ display: "flex", gap: 10 }}>
              <input
                className="input"
                name="q"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Buscar notícias, negócios, eventos, vagas…"
                style={{ flex: 1, fontSize: 18 }}
                autoFocus
              />
              <button type="submit" className="btn btn-primary" style={{ padding: "10px 24px" }}>Buscar</button>
            </form>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "28px 20px" }}>
        {/* Filters */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
          {FILTERS.map(([f, n]) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={activeFilter === f ? "btn btn-primary btn-sm" : "btn btn-outline btn-sm"}
            >
              {f} <span className="t-mono" style={{ opacity: .7 }}>({n})</span>
            </button>
          ))}
        </div>

        {query ? (
          <div>
            <div className="sec-label bold" style={{ marginBottom: 16 }}>{results.length} resultados</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {results.map((r, i) => (
                <Link key={i} href={`/${r.slug}`}>
                  <div style={{
                    padding: "16px 0", borderBottom: "1px solid var(--border)",
                    display: "flex", gap: 14, alignItems: "flex-start", cursor: "pointer",
                  }}>
                    <div style={{ flexShrink: 0 }}>
                      <span className={`cat-tag ${TYPE_COLORS[r.type] ?? "cidade"}`}>{r.type}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, lineHeight: 1.3, color: "var(--ink)", marginBottom: 4 }}>
                        {r.title}
                      </div>
                      <div className="row" style={{ gap: 8 }}>
                        <span className="t-mono color-muted" style={{ fontSize: 11 }}>{r.cat}</span>
                        <span className="t-mono color-muted" style={{ fontSize: 11 }}>·</span>
                        <span className="t-mono color-muted" style={{ fontSize: 11 }}>{r.time}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, marginBottom: 8 }}>O que você procura?</div>
            <div className="t-small color-muted">Busque notícias, negócios no guia, eventos na agenda ou vagas de emprego</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 24 }}>
              {["Cataratas","Câmbio","Empregos","Turismo","Ponte Amizade","Itaipu"].map(t => (
                <Link key={t} href={`/busca?q=${encodeURIComponent(t)}`}>
                  <button className="pill" style={{ cursor: "pointer" }}>{t}</button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function BuscaPage() {
  return (
    <Suspense>
      <BuscaContent />
    </Suspense>
  );
}
