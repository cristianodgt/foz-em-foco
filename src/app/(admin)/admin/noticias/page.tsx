import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye, Edit, Plus } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  publicado: "bg-green-900/50 text-green-400",
  rascunho: "bg-gray-800 text-white/40",
  revisao: "bg-yellow-900/50 text-yellow-400",
  agendado: "bg-blue-900/50 text-blue-400",
};

interface Props {
  searchParams: Promise<{ status?: string; page?: string }>;
}

export default async function NoticiasPage({ searchParams }: Props) {
  const { status, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10));
  const PER_PAGE = 20;

  const where = status ? { status: status as any } : {};
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: { category: true, author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.article.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Notícias</h1>
          <p className="text-white/40 text-sm">{total} artigos</p>
        </div>
        <Link href="/admin/noticias/novo" className="flex items-center gap-2 bg-teal text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-dark transition-colors">
          <Plus size={16} /> Nova notícia
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {["", "publicado", "rascunho", "revisao", "agendado"].map((s) => (
          <Link
            key={s}
            href={s ? `?status=${s}` : "/admin/noticias"}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors ${status === s || (!status && !s) ? "bg-teal text-white border-teal" : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"}`}
          >
            {s || "Todos"}
          </Link>
        ))}
      </div>

      <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5 text-xs font-mono text-white/30 uppercase">
              <th className="text-left px-4 py-3">Título</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Categoria</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Autor</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3 hidden sm:table-cell">Views</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm text-white/80 line-clamp-1">{a.title}</p>
                  <p className="text-xs text-white/30 font-mono mt-0.5">/{a.slug}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs text-white/50 font-mono">{a.category.name}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-xs text-white/50">{a.author.name}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded font-mono ${STATUS_COLORS[a.status]}`}>{a.status}</span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-right">
                  <span className="text-xs text-white/30 font-mono flex items-center gap-1 justify-end">
                    <Eye size={10} />{a.views.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/noticias/${a.id}`} className="text-white/30 hover:text-teal transition-colors">
                    <Edit size={14} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a key={p} href={`?${status ? `status=${status}&` : ""}page=${p}`}
              className={`w-8 h-8 flex items-center justify-center rounded text-xs font-mono border transition-colors ${p === page ? "bg-teal text-white border-teal" : "border-white/10 text-white/40 hover:border-white/30"}`}
            >{p}</a>
          ))}
        </div>
      )}
    </div>
  );
}
