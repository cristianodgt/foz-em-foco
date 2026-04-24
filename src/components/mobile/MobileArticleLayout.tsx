"use client";

const teal = "#0a7a6b";
const tealPale = "#e6f4f2";
const ink = "#111";
const border = "#e2e8f0";
const muted = "#888";
const paper2 = "#f5f7fa";

type Props = {
  category?: { name?: string | null; slug?: string | null } | null;
  title?: string | null;
  lead?: string | null;
  imageUrl?: string | null;
  authorName?: string | null;
  authorInitial?: string | null;
  publishedLabel?: string | null;
  readTime?: number | null;
  views?: number | null;
  bodyHtml?: string | null;
  tags?: { id?: string | number; name: string }[];
  related?: { id?: string | number; title: string }[];
};

export default function MobileArticleLayout({
  category,
  title,
  lead,
  imageUrl,
  authorName,
  authorInitial,
  publishedLabel,
  readTime,
  views,
  bodyHtml,
  tags,
  related,
}: Props) {
  const catLabel = (category?.name || "CIDADE").toString().toUpperCase();
  const subLabel = "OBRAS";
  return (
    <div style={{ background: "#f5f7fa", paddingBottom: 120 }}>
      {/* Back + share/save */}
      <div
        style={{
          padding: "10px 16px",
          display: "flex",
          justifyContent: "space-between",
          background: "white",
        }}
      >
        <button
          onClick={() => history.back()}
          style={{
            background: "transparent",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: 4,
            color: ink,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Voltar
        </button>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            aria-label="Compartilhar"
            style={{
              width: 32,
              height: 32,
              border: "none",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={ink}
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
            </svg>
          </button>
          <button
            aria-label="Salvar"
            style={{
              width: 32,
              height: 32,
              border: "none",
              background: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={ink}
              strokeWidth="2"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>

      <div style={{ background: "white" }}>
        {/* Cover */}
        {imageUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageUrl}
            alt={title ?? ""}
            style={{
              display: "block",
              width: "100%",
              aspectRatio: "16/10",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              aspectRatio: "16/10",
              background: "#dde2e8",
              backgroundImage:
                "linear-gradient(135deg,#dde2e8 25%,#cdd2d8 25%,#cdd2d8 50%,#dde2e8 50%,#dde2e8 75%,#cdd2d8 75%)",
              backgroundSize: "24px 24px",
            }}
          />
        )}

        <div style={{ padding: "20px 16px" }}>
          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.1em",
              padding: "3px 10px",
              borderRadius: 4,
              background: tealPale,
              color: teal,
              marginBottom: 12,
            }}
          >
            {catLabel} · {subLabel}
          </span>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 26,
              lineHeight: 1.15,
              color: ink,
              marginBottom: 12,
            }}
          >
            {title}
          </h1>
          {lead && (
            <p
              style={{
                fontSize: 15,
                color: "#555",
                lineHeight: 1.5,
                marginBottom: 16,
              }}
            >
              {lead}
            </p>
          )}

          {/* Author */}
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              padding: "12px 0",
              borderTop: `1px solid ${border}`,
              borderBottom: `1px solid ${border}`,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: teal,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {(authorInitial || authorName?.[0] || "R").toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>
                {authorName || "Redação"}
              </div>
              <div style={{ fontSize: 11, color: muted }}>
                Repórter · {category?.name || "Cidade"}
              </div>
            </div>
            <div
              style={{
                fontSize: 10,
                color: muted,
                fontFamily: "var(--font-mono)",
                textAlign: "right",
              }}
            >
              {publishedLabel && <div>{publishedLabel}</div>}
              <div>
                {readTime ? `${readTime} min` : "—"}
                {views ? ` · ${views.toLocaleString("pt-BR")} views` : ""}
              </div>
            </div>
          </div>

          {/* Body */}
          {bodyHtml ? (
            <div
              style={{
                fontSize: 16,
                lineHeight: 1.65,
                color: "#222",
                fontFamily: "Georgia, serif",
              }}
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          ) : (
            [
              "As primeiras equipes da concessionária chegaram à estrutura às 6h da manhã para iniciar os testes estáticos da nova ponte binacional.",
              "A obra, orçada em R$ 380 milhões, deve desafogar o fluxo da Ponte da Amizade em até 40%, segundo projeções do DNIT.",
              'O secretário de mobilidade afirmou que "o objetivo é ter 100% da infraestrutura validada até agosto, para começar a operação em setembro".',
            ].map((p, i) => (
              <p
                key={i}
                style={{
                  fontSize: 16,
                  lineHeight: 1.65,
                  color: "#222",
                  marginBottom: 14,
                  fontFamily: "Georgia, serif",
                }}
              >
                {p}
              </p>
            ))
          )}

          {/* In-content ad roxo */}
          <div
            style={{
              margin: "16px 0",
              background: "linear-gradient(135deg,#6c3483,#9b59b6)",
              color: "white",
              borderRadius: 10,
              padding: 14,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                opacity: 0.7,
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              PUBLICIDADE
            </div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 17 }}>
              Copel Telecom — Fibra 500MB
            </div>
            <div style={{ fontSize: 11, opacity: 0.9, marginTop: 4 }}>
              R$ 99,90/mês · instalação grátis
            </div>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
                marginTop: 20,
                paddingTop: 16,
                borderTop: `1px solid ${border}`,
              }}
            >
              {tags.map((t) => (
                <span
                  key={t.id ?? t.name}
                  style={{
                    fontSize: 11,
                    padding: "4px 10px",
                    border: `1px solid ${border}`,
                    borderRadius: 999,
                    background: "white",
                    color: "#555",
                  }}
                >
                  #{t.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related */}
      {related && related.length > 0 && (
        <div style={{ padding: "20px 16px", background: paper2 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: muted,
              letterSpacing: "0.08em",
              fontWeight: 600,
              marginBottom: 12,
            }}
          >
            RELACIONADOS
          </div>
          {related.slice(0, 5).map((t, i) => (
            <div
              key={t.id ?? i}
              style={{
                padding: "10px 0",
                borderBottom:
                  i < Math.min(related.length, 5) - 1
                    ? `1px solid ${border}`
                    : "none",
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 18,
                  color: teal,
                  fontWeight: 700,
                  flexShrink: 0,
                  lineHeight: 1,
                }}
              >
                {(i + 1).toString().padStart(2, "0")}
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontFamily: "var(--font-serif)",
                  lineHeight: 1.3,
                }}
              >
                {t.title}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
