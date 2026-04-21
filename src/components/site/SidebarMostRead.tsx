import Link from "next/link";

interface Article {
  id: string;
  title: string;
  slug: string;
  views: number;
  category: { name: string; slug: string };
}

interface Props {
  articles?: Article[];
}

const FALLBACK = [
  { title: "Itaipu investe R$ 800 mi em energia renovável", cat: "Economia", views: "12.4k" },
  { title: "Concurso prefeitura: 450 vagas abertas", cat: "Cidade", views: "9.8k" },
  { title: "Cataratas batem recorde de visitantes em abril", cat: "Turismo", views: "8.2k" },
  { title: "Wepink inaugura 2ª loja no Catuaí", cat: "Economia", views: "6.1k" },
  { title: "Novo voo direto pra Montevidéu pelo IGU", cat: "Turismo", views: "5.4k" },
];

export default function SidebarMostRead({ articles }: Props) {
  return (
    <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="t-h4">Mais lidas</span>
        <span className="t-mono color-muted">24h</span>
      </div>
      {articles && articles.length > 0 ? articles.map((a, i) => (
        <Link key={a.id} href={`/${a.category.slug}/${a.slug}`}>
          <div style={{ padding: "12px 16px", borderBottom: i < 4 ? "1px solid var(--border)" : "none", display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
            <span style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--teal)", lineHeight: 1, flexShrink: 0, width: 32, textAlign: "center" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div style={{ flex: 1 }}>
              <div className="t-small truncate-2" style={{ fontFamily: "var(--font-serif)", lineHeight: 1.3, color: "var(--ink)", marginBottom: 4 }}>
                {a.title}
              </div>
              <div className="row" style={{ gap: 6 }}>
                <span className={`cat-tag ${a.category.slug}`}>{a.category.name}</span>
                <span className="t-mono color-muted">{a.views.toLocaleString()} views</span>
              </div>
            </div>
          </div>
        </Link>
      )) : FALLBACK.map(({ title, cat, views }, i) => (
        <div key={i} style={{ padding: "12px 16px", borderBottom: i < 4 ? "1px solid var(--border)" : "none", display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--teal)", lineHeight: 1, flexShrink: 0, width: 32, textAlign: "center" }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <div style={{ flex: 1 }}>
            <div className="t-small" style={{ fontFamily: "var(--font-serif)", lineHeight: 1.3, color: "var(--ink)", marginBottom: 4 }}>
              {title}
            </div>
            <div className="row" style={{ gap: 6 }}>
              <span className={`cat-tag ${cat.toLowerCase()}`}>{cat}</span>
              <span className="t-mono color-muted">{views} views</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
