import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";

type CardVariant = "xl" | "lg" | "md" | "sm" | "horizontal";

interface NewsCardProps {
  title: string;
  category: string;
  slug: string;
  categorySlug: string;
  meta?: string;
  imageUrl?: string;
  sponsor?: string;
  variant?: CardVariant;
  className?: string;
}

export default function NewsCard({
  title,
  category,
  slug,
  categorySlug,
  meta,
  imageUrl,
  sponsor,
  variant = "md",
  className = "",
}: NewsCardProps) {
  const href = `/${categorySlug}/${slug}`;

  if (variant === "horizontal") {
    return (
      <Link href={href} className={`flex gap-3 group ${className}`}>
        {imageUrl && (
          <div className="relative w-24 h-16 shrink-0 rounded overflow-hidden">
            <Image src={imageUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <Badge category={categorySlug} label={category} className="mb-1" />
          <h3 className="text-sm font-semibold text-ink line-clamp-2 group-hover:text-teal transition-colors leading-snug">
            {title}
          </h3>
          {meta && <p className="text-xs text-muted mt-1 font-mono">{meta}</p>}
        </div>
      </Link>
    );
  }

  if (variant === "sm") {
    return (
      <Link href={href} className={`flex gap-3 group ${className}`}>
        {imageUrl && (
          <div className="relative w-20 h-14 shrink-0 rounded overflow-hidden">
            <Image src={imageUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-ink line-clamp-2 group-hover:text-teal transition-colors leading-snug">
            {title}
          </h3>
          {meta && <p className="text-xs text-muted mt-1 font-mono">{meta}</p>}
        </div>
      </Link>
    );
  }

  const imageHeights: Record<CardVariant, string> = {
    xl: "h-80",
    lg: "h-56",
    md: "h-44",
    sm: "h-14",
    horizontal: "h-16",
  };

  const titleSizes: Record<CardVariant, string> = {
    xl: "text-3xl font-bold leading-tight font-serif",
    lg: "text-xl font-bold leading-snug",
    md: "text-base font-semibold leading-snug",
    sm: "text-sm font-semibold",
    horizontal: "text-sm font-semibold",
  };

  return (
    <Link
      href={href}
      className={`group block overflow-hidden rounded-lg bg-white border border-border hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 ${className}`}
    >
      {imageUrl && (
        <div className={`relative ${imageHeights[variant]} overflow-hidden`}>
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {sponsor && (
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded font-mono">
              Patrocinado por {sponsor}
            </span>
          )}
        </div>
      )}
      <div className="p-4">
        <Badge category={categorySlug} label={category} className="mb-2" />
        <h3 className={`text-ink group-hover:text-teal transition-colors ${titleSizes[variant]}`}>
          {title}
        </h3>
        {meta && <p className="text-xs text-muted mt-2 font-mono">{meta}</p>}
      </div>
    </Link>
  );
}
