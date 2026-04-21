import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Phone, MessageCircle, ExternalLink } from "lucide-react";
import Badge from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Guia Comercial — Foz do Iguaçu",
  description: "Encontre restaurantes, hotéis, lojas e serviços em Foz do Iguaçu. Guia completo de negócios locais.",
  path: "/guia",
});

const PER_PAGE = 20;

interface Props {
  searchParams: Promise<{ q?: string; categoria?: string; page?: string }>;
}

const PLAN_BADGE: Record<string, string> = {
  ouro: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  prata: "bg-gray-100 text-gray-700 border border-gray-300",
  basico: "",
};

const PLAN_LABEL: Record<string, string> = {
  ouro: "⭐ Ouro",
  prata: "Prata",
  basico: "Básico",
};

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <span className="flex items-center gap-1 text-xs font-mono text-muted">
      <Star size={12} className="text-yellow-400 fill-yellow-400" />
      {rating.toFixed(1)} ({count})
    </span>
  );
}

export default async function GuiaPage({ searchParams }: Props) {
  const { q, categoria, page: pageStr } = await searchParams;
  const page = Math.max(1, parseInt(pageStr ?? "1", 10));

  const categories = await prisma.businessCategory.findMany({ orderBy: { name: "asc" } });

  const whereClause: Record<string, unknown> = { active: true };
  if (categoria) whereClause.category = { slug: categoria };
  if (q) {
    whereClause.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
      { bairro: { contains: q, mode: "insensitive" } },
    ];
  }

  const [businesses, total] = await Promise.all([
    prisma.business.findMany({
      where: whereClause as any,
      include: { category: true, photos: { take: 1, orderBy: { order: "asc" } }, reviews: { where: { approved: true } } },
      orderBy: [{ plan: "desc" }, { name: "asc" }],
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.business.count({ where: whereClause as any }),
  ]);

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-serif text-4xl font-bold text-ink">Guia Comercial</h1>
        <p className="text-muted mt-1">Encontre negócios em Foz do Iguaçu e tríplice fronteira</p>
      </div>

      {/* Search + filters */}
      <form className="flex flex-col sm:flex-row gap-3 mb-8" method="GET">
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome, bairro, serviço..."
          className="flex-1 text-sm border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/30"
        />
        <select
          name="categoria"
          defaultValue={categoria ?? ""}
          className="text-sm border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal/30 bg-white"
        >
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-teal text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-teal-dark transition-colors text-sm">
          Buscar
        </button>
      </form>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2 mb-6">
        <Link href="/guia" className={`shrink-0 px-3 py-1.5 rounded-full text-sm border transition-colors ${!categoria ? "bg-teal text-white border-teal" : "border-border hover:border-teal hover:text-teal"}`}>
          Todos
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/guia?${categoria === c.slug ? "" : `categoria=${c.slug}`}${q ? `&q=${q}` : ""}`}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm border transition-colors ${categoria === c.slug ? "bg-teal text-white border-teal" : "border-border hover:border-teal hover:text-teal"}`}
          >
            {c.icon} {c.name}
          </Link>
        ))}
      </div>

      <p className="text-sm text-muted mb-5 font-mono">{total} resultado{total !== 1 ? "s" : ""}</p>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {businesses.map((b) => {
          const avgRating = b.reviews.length > 0
            ? b.reviews.reduce((s, r) => s + r.rating, 0) / b.reviews.length
            : 0;
          const photo = b.photos[0];

          return (
            <Link
              key={b.id}
              href={`/guia/${b.category.slug}/${b.slug}`}
              className={`group block rounded-xl overflow-hidden border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md bg-white ${b.plan === "ouro" ? "border-yellow-300" : "border-border"}`}
            >
              {/* Photo */}
              <div className="relative h-40 bg-gray-100">
                {photo ? (
                  <Image src={photo.url} alt={b.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="h-full flex items-center justify-center text-3xl">🏪</div>
                )}
                {b.plan !== "basico" && (
                  <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${PLAN_BADGE[b.plan]}`}>
                    {PLAN_LABEL[b.plan]}
                  </span>
                )}
              </div>

              <div className="p-4">
                <p className="text-xs text-muted font-mono mb-1">{b.category.name}</p>
                <h3 className="font-semibold text-ink group-hover:text-teal transition-colors line-clamp-1">{b.name}</h3>

                {b.reviews.length > 0 && (
                  <div className="mt-1">
                    <StarRating rating={avgRating} count={b.reviews.length} />
                  </div>
                )}

                {b.bairro && (
                  <p className="flex items-center gap-1 text-xs text-muted mt-2">
                    <MapPin size={10} /> {b.bairro}
                  </p>
                )}

                <div className="flex gap-2 mt-3">
                  {b.phone && (
                    <a
                      href={`tel:${b.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-xs border border-border rounded px-2 py-1 hover:border-teal hover:text-teal transition-colors"
                    >
                      <Phone size={10} /> Ligar
                    </a>
                  )}
                  {b.whatsapp && (
                    <a
                      href={`https://wa.me/${b.whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-xs border border-green-300 text-green-700 rounded px-2 py-1 hover:bg-green-50 transition-colors"
                    >
                      <MessageCircle size={10} /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {businesses.length === 0 && (
        <div className="text-center py-20 text-muted">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-medium">Nenhum resultado encontrado</p>
          <p className="text-sm mt-1">Tente outros termos ou categorias</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a key={p} href={`?${new URLSearchParams({ ...(q ? { q } : {}), ...(categoria ? { categoria } : {}), page: String(p) })}`}
              className={`w-9 h-9 flex items-center justify-center rounded text-sm font-medium border transition-colors ${p === page ? "bg-teal text-white border-teal" : "border-border hover:border-teal hover:text-teal"}`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
