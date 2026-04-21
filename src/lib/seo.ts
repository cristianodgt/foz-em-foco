import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://fozemfoco.com.br";
const SITE_NAME = "Foz em Foco";

export function buildMetadata({
  title,
  description,
  image,
  path = "",
  type = "website",
}: {
  title: string;
  description: string;
  image?: string;
  path?: string;
  type?: "website" | "article";
}): Metadata {
  const url = `${BASE_URL}${path}`;
  const ogImage = image ?? `${BASE_URL}/og-default.jpg`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type,
      locale: "pt_BR",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage],
    },
  };
}

export function buildArticleJsonLd({
  title,
  description,
  image,
  publishedAt,
  updatedAt,
  authorName,
  path,
}: {
  title: string;
  description: string;
  image: string;
  publishedAt: Date;
  updatedAt: Date;
  authorName: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: title,
    description,
    image,
    datePublished: publishedAt.toISOString(),
    dateModified: updatedAt.toISOString(),
    author: { "@type": "Person", name: authorName },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${BASE_URL}${path}` },
  };
}
