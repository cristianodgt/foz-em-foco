import Link from "next/link";

interface Article {
  id: string;
  title: string;
  slug: string;
  publishedAt: Date | null;
  category: { name: string; slug: string };
}

interface Props {
  articles?: Article[];
}

const FALLBACK = [
  { time: "14:08", title: "Operação PF fecha parte da Ponte Amizade", cat: "Segurança" },
  { time: "13:42", title: "Câmara aprova Plano Diretor em 2ª votação", cat: "Política" },
  { time: "13:15", title: "Cataratas: vazão sobe 12% em 24h", cat: "Turismo" },
  { time: "12:50", title: "Novo restaurante no Gramadão abre nesta sex", cat: "Cidade" },
  { time: "12:30", title: "Prefeitura anuncia pacote de obras no Centro", cat: "Cidade" },
  { time: "12:10", title: "Câmbio: Real cede ante Guarani pela 3ª vez", cat: "Economia" },
  { time: "11:48", title: "Hotel Bourbon inaugura nova ala no Foz Plaza", cat: "Turismo" },
];

function formatTime(date: Date | null) {
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(new Date(date));
}

export default function SidebarLatest({ articles }: Props) {
  return (
    <div style={{ background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden" }}>
      <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="t-h4">Últimas</span>
        <span className="t-mono" style={{ color: "var(--teal)", fontWeight: 600 }}>● ao vivo</span>
      </div>
      {articles && articles.length > 0 ? articles.map((a, i) => (
        <Link key={a.id} href={`/${a.category.slug}/${a.slug}`}>
          <div style={{ padding: "10px 16px", borderBottom: i < articles.length - 1 ? "1px solid var(--border)" : "none", display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
            <span className="t-mono" style={{ color: "var(--teal)", flexShrink: 0, fontSize: 11 }}>
              {formatTime(a.publishedAt)}
            </span>
            <div>
              <div className="t-small" style={{ lineHeight: 1.3, color: "var(--ink)" }}>{a.title}</div>
              <span className={`cat-tag ${a.category.slug} mt-xs`} style={{ display: "inline-block" }}>{a.category.name}</span>
            </div>
          </div>
        </Link>
      )) : FALLBACK.map(({ time, title, cat }, i) => (
        <div key={i} style={{ padding: "10px 16px", borderBottom: i < FALLBACK.length - 1 ? "1px solid var(--border)" : "none", display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
          <span className="t-mono" style={{ color: "var(--teal)", flexShrink: 0, fontSize: 11 }}>{time}</span>
          <div>
            <div className="t-small" style={{ lineHeight: 1.3, color: "var(--ink)" }}>{title}</div>
            <span className={`cat-tag ${cat.toLowerCase()} mt-xs`} style={{ display: "inline-block" }}>{cat}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
