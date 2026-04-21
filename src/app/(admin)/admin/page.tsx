import { prisma } from "@/lib/prisma";
import { FileText, Eye, MessageSquare, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

async function getStats() {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [totalArticles, publishedToday, pendingComments, totalSubscribers, topArticles, recentArticles] = await Promise.all([
    prisma.article.count({ where: { status: "publicado" } }),
    prisma.article.count({ where: { status: "publicado", publishedAt: { gte: yesterday } } }),
    prisma.comment.count({ where: { status: "pendente" } }),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
    prisma.article.findMany({
      where: { status: "publicado", publishedAt: { gte: yesterday } },
      orderBy: { views: "desc" },
      take: 5,
      include: { category: true },
    }),
    prisma.article.findMany({
      where: { status: "publicado" },
      orderBy: { publishedAt: "desc" },
      take: 8,
      include: { category: true, author: { select: { name: true } } },
    }),
  ]);
  return { totalArticles, publishedToday, pendingComments, totalSubscribers, topArticles, recentArticles };
}

function formatDate(d: Date | null) {
  if (!d) return "—";
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(d));
}

export default async function AdminDashboard() {
  const { totalArticles, publishedToday, pendingComments, totalSubscribers, topArticles, recentArticles } = await getStats();

  const stats = [
    { label: "Artigos publicados", value: totalArticles.toLocaleString(), icon: FileText, color: "text-blue-400", href: "/admin/noticias" },
    { label: "Publicados hoje", value: publishedToday.toLocaleString(), icon: TrendingUp, color: "text-green-400", href: "/admin/noticias" },
    { label: "Comentários pendentes", value: pendingComments.toLocaleString(), icon: MessageSquare, color: "text-yellow-400", href: "/admin/comentarios" },
    { label: "Inscritos newsletter", value: totalSubscribers.toLocaleString(), icon: Users, color: "text-teal", href: "/admin/newsletter" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Bem-vindo ao painel Foz em Foco</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-gray-900 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-white/40 font-mono uppercase tracking-wide">{s.label}</p>
              <s.icon size={16} className={s.color} />
            </div>
            <p className={`text-3xl font-bold font-mono ${s.color}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top articles */}
        <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4 text-sm">Top artigos (últimas 24h)</h2>
          {topArticles.length > 0 ? (
            <div className="flex flex-col gap-3">
              {topArticles.map((a, i) => (
                <div key={a.id} className="flex items-center gap-3">
                  <span className="text-lg font-bold font-mono text-white/20 w-6">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <Link href={`/admin/noticias/${a.id}`} className="text-sm text-white/80 hover:text-white line-clamp-1">{a.title}</Link>
                    <p className="text-xs text-white/30 font-mono">{a.category.name}</p>
                  </div>
                  <span className="text-xs font-mono text-white/40 flex items-center gap-1">
                    <Eye size={10} /> {a.views.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/30 text-sm">Nenhum artigo publicado hoje.</p>
          )}
        </div>

        {/* Recent */}
        <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm">Atividade recente</h2>
            <Link href="/admin/noticias/novo" className="text-xs bg-teal text-white px-3 py-1 rounded hover:bg-teal-dark transition-colors">
              + Nova notícia
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {recentArticles.map((a) => (
              <div key={a.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <Link href={`/admin/noticias/${a.id}`} className="text-sm text-white/80 hover:text-white line-clamp-1">{a.title}</Link>
                  <p className="text-xs text-white/30 font-mono">
                    {a.author.name} · {formatDate(a.publishedAt)}
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded font-mono ${a.status === "publicado" ? "bg-green-900/50 text-green-400" : "bg-yellow-900/50 text-yellow-400"}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
