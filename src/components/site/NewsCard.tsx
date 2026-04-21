import Link from "next/link";
import Image from "next/image";

type CardVariant = "xl" | "lg" | "md" | "sm" | "horizontal";

interface NewsCardProps {
  title: string;
  category: string;
  categorySlug: string;
  slug: string;
  meta?: string;
  imageUrl?: string;
  sponsor?: boolean | string;
  variant?: CardVariant;
  className?: string;
}

const imgRatioMap: Record<CardVariant, string> = {
  xl: "16/7",
  lg: "3/2",
  md: "4/3",
  sm: "4/3",
  horizontal: "1/1",
};

const titleClassMap: Record<CardVariant, string> = {
  xl: "t-display",
  lg: "t-h2",
  md: "t-h3",
  sm: "t-h4",
  horizontal: "t-small",
};

const paddingMap: Record<CardVariant, string | number> = {
  xl: "24px 28px",
  lg: "16px 20px",
  md: "12px 16px",
  sm: "10px 14px",
  horizontal: "10px 14px",
};

function ImgPlaceholder({ ratio, label }: { ratio: string; label: string }) {
  return (
    <div
      className="imgph"
      data-label={label}
      style={{ aspectRatio: ratio, width: "100%" }}
    />
  );
}

export default function NewsCard({
  title,
  category,
  categorySlug,
  slug,
  meta,
  imageUrl,
  sponsor,
  variant = "md",
  className = "",
}: NewsCardProps) {
  const href = `/${categorySlug}/${slug}`;
  const cc = categorySlug.replace(/[^a-z]/g, "");

  if (variant === "horizontal") {
    return (
      <Link href={href}>
        <div className="card" style={{ display: "flex", cursor: "pointer" }}>
          {imageUrl ? (
            <div style={{ width: 100, flexShrink: 0, position: "relative", overflow: "hidden" }}>
              <Image src={imageUrl} alt={title} fill style={{ objectFit: "cover" }} />
            </div>
          ) : (
            <ImgPlaceholder ratio="1/1" label={categorySlug} />
          )}
          <div style={{ padding: "10px 14px", flex: 1 }}>
            <div className="row" style={{ gap: 6, marginBottom: 4 }}>
              <span className={`cat-tag ${cc}`}>{category}</span>
              {sponsor && <span className="cat-tag patrocinado">Patrocinado</span>}
            </div>
            <div
              className="t-small truncate-2"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 400, lineHeight: 1.3, color: "var(--ink)" }}
            >
              {title}
            </div>
            {meta && <div className="t-mono color-muted mt-xs">{meta}</div>}
          </div>
        </div>
      </Link>
    );
  }

  const ratio = imgRatioMap[variant];
  const titleCls = titleClassMap[variant];
  const pad = paddingMap[variant];

  return (
    <Link href={href}>
      <div className={`card ${className}`} style={{ cursor: "pointer" }}>
        {imageUrl ? (
          <div style={{ position: "relative", aspectRatio: ratio, width: "100%", overflow: "hidden" }}>
            <Image src={imageUrl} alt={title} fill style={{ objectFit: "cover" }} />
          </div>
        ) : (
          <ImgPlaceholder ratio={ratio} label={categorySlug} />
        )}
        <div style={{ padding: pad as string }}>
          <div className="row" style={{ gap: 6, marginBottom: 6 }}>
            <span className={`cat-tag ${cc}`}>{category}</span>
            {sponsor && <span className="cat-tag patrocinado">Patrocinado</span>}
          </div>
          <div
            className={titleCls}
            style={{ fontFamily: "var(--font-serif)", color: "var(--ink)", marginBottom: 8 }}
          >
            {title}
          </div>
          {variant !== "sm" && meta && (
            <div className="t-mono color-muted">{meta}</div>
          )}
        </div>
      </div>
    </Link>
  );
}
