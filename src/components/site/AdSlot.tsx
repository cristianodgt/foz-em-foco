"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

interface Creative {
  id: string;
  imageUrl: string;
  linkUrl: string;
  altText?: string;
  advertiserName?: string;
}

interface AdSlotProps {
  slotId: string;
  className?: string;
}

export default function AdSlot({ slotId, className = "" }: AdSlotProps) {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    fetch(`/api/ads/slots?slot=${slotId}`)
      .then((r) => r.json())
      .then((data) => setCreatives(data))
      .catch(() => {});
  }, [slotId]);

  const rotate = useCallback(() => {
    if (creatives.length <= 1) return;
    setFading(true);
    setTimeout(() => {
      setCurrentIndex((i) => (i + 1) % creatives.length);
      setFading(false);
    }, 300);
  }, [creatives.length]);

  useEffect(() => {
    if (creatives.length <= 1) return;
    const interval = setInterval(rotate, 5000);
    return () => clearInterval(interval);
  }, [rotate, creatives.length]);

  if (!visible || creatives.length === 0) return null;

  const current = creatives[currentIndex];
  const isSticky = slotId === "sticky";

  return (
    <div
      className={[
        "relative overflow-hidden",
        isSticky && "fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-black/10 backdrop-blur-sm py-2",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="relative inline-block">
        <Link href={current.linkUrl} target="_blank" rel="noopener noreferrer sponsored">
          <div
            className={`transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
          >
            <Image
              src={current.imageUrl}
              alt={current.altText ?? `Anúncio ${current.advertiserName ?? ""}`}
              width={970}
              height={90}
              className="max-w-full h-auto"
              unoptimized
            />
          </div>
        </Link>
        {isSticky && (
          <button
            onClick={() => setVisible(false)}
            className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow border border-border hover:bg-gray-100"
            aria-label="Fechar anúncio"
          >
            <X size={12} />
          </button>
        )}
        <span className="absolute bottom-1 left-1 text-[9px] text-white/60 font-mono bg-black/30 px-1 rounded">
          Anúncio
        </span>
      </div>
    </div>
  );
}
