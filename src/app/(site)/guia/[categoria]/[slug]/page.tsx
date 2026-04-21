import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Globe, MessageCircle, Star, ChevronRight, Clock } from "lucide-react";
import BusinessReviewForm from "@/components/site/BusinessReviewForm";

interface Props {
  params: Promise<{ categoria: string; slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const b = await prisma.business.findUnique({ where: { slug }, include: { category: true } });
  if (!b) return {};
  return buildMetadata({
    title: b.metaTitle ?? `${b.name} — Guia Comercial Foz do Iguaçu`,
    description: b.metaDescription ?? b.description ?? `${b.name} em Foz do Iguaçu.`,
    path: `/guia/${b.category.slug}/${b.slug}`,
  });
}

export default async function BusinessPage({ params }: Props) {
  const { slug } = await params;

  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      category: true,
      photos: { orderBy: { order: "asc" } },
      reviews: { where: { approved: true }, orderBy: { createdAt: "desc" } },
    },
  });

  if (!business || !business.active) notFound();

  const avgRating = business.reviews.length > 0
    ? business.reviews.reduce((s, r) => s + r.rating, 0) / business.reviews.length
    : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    description: business.description,
    address: { "@type": "PostalAddress", streetAddress: business.address, addressLocality: "Foz do Iguaçu", addressCountry: "BR" },
    telephone: business.phone,
    url: business.website,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 text-xs text-muted mb-6 font-mono">
          <Link href="/" className="hover:text-teal">Home</Link>
          <ChevronRight size={12} />
          <Link href="/guia" className="hover:text-teal">Guia Comercial</Link>
          <ChevronRight size={12} />
          <Link href={`/guia/${business.category.slug}`} className="hover:text-teal">{business.category.name}</Link>
          <ChevronRight size={12} />
          <span className="text-ink-2">{business.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2">
            {/* Photo gallery */}
            {business.photos.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="col-span-2 relative h-64 rounded-lg overflow-hidden">
                  <Image src={business.photos[0].url} alt={business.name} fill className="object-cover" />
                </div>
                <div className="flex flex-col gap-2">
                  {business.photos.slice(1, 3).map((p) => (
                    <div key={p.id} className="relative flex-1 rounded-lg overflow-hidden">
                      <Image src={p.url} alt={p.caption ?? business.name} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h1 className="font-serif text-3xl font-bold text-ink mb-2">{business.name}</h1>
            <p className="text-sm text-muted font-mono mb-4">{business.category.name}</p>

            {business.reviews.length > 0 && (
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={18} className={s <= Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                ))}
                <span className="font-mono text-sm text-muted">{avgRating.toFixed(1)} ({business.reviews.length} avaliações)</span>
              </div>
            )}

            {business.description && (
              <div className="prose prose-sm max-w-none mb-6 text-ink-2">
                <p>{business.description}</p>
              </div>
            )}

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-6">
              {business.delivery && <span className="text-xs px-3 py-1 bg-teal-light text-teal rounded-full font-medium">🛵 Delivery</span>}
              {business.aceitaPix && <span className="text-xs px-3 py-1 bg-teal-light text-teal rounded-full font-medium">💸 Aceita PIX</span>}
              {business.petFriendly && <span className="text-xs px-3 py-1 bg-teal-light text-teal rounded-full font-medium">🐾 Pet Friendly</span>}
              {business.reserva && <span className="text-xs px-3 py-1 bg-teal-light text-teal rounded-full font-medium">📅 Reservas</span>}
            </div>

            {/* Reviews */}
            <div className="mt-8">
              <h2 className="font-serif text-xl font-bold text-ink mb-4">Avaliações</h2>
              {business.reviews.length > 0 ? (
                <div className="flex flex-col gap-4 mb-6">
                  {business.reviews.map((r) => (
                    <div key={r.id} className="bg-paper border border-border rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-teal-light flex items-center justify-center text-teal font-bold text-sm">
                          {r.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-sm text-ink">{r.name}</p>
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map((s) => (
                              <Star key={s} size={10} className={s <= r.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      {r.body && <p className="text-sm text-ink-2">{r.body}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted mb-6">Seja o primeiro a avaliar!</p>
              )}

              <BusinessReviewForm businessId={business.id} />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            <div className="bg-white border border-border rounded-xl p-5 flex flex-col gap-4">
              {business.address && (
                <div className="flex gap-3 text-sm">
                  <MapPin size={16} className="text-teal shrink-0 mt-0.5" />
                  <span className="text-ink-2">{business.address}{business.bairro ? `, ${business.bairro}` : ""}</span>
                </div>
              )}
              {business.phone && (
                <a href={`tel:${business.phone}`} className="flex gap-3 text-sm hover:text-teal transition-colors">
                  <Phone size={16} className="text-teal shrink-0" />
                  <span>{business.phone}</span>
                </a>
              )}
              {business.website && (
                <a href={business.website} target="_blank" rel="noopener noreferrer" className="flex gap-3 text-sm hover:text-teal transition-colors">
                  <Globe size={16} className="text-teal shrink-0" />
                  <span className="truncate">{business.website.replace(/^https?:\/\//, "")}</span>
                </a>
              )}
            </div>

            {business.whatsapp && (
              <a
                href={`https://wa.me/${business.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 text-white font-semibold py-3 rounded-xl hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={18} />
                Chamar no WhatsApp
              </a>
            )}

            {business.lat && business.lng && (
              <div className="rounded-xl overflow-hidden border border-border">
                <iframe
                  title="Localização"
                  width="100%"
                  height="200"
                  loading="lazy"
                  src={`https://maps.google.com/maps?q=${business.lat},${business.lng}&z=15&output=embed`}
                />
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
