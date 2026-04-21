"use client";

import { useState, useEffect } from "react";

const AD_INVENTORY = [
  { anunc: "Sicredi Foz",         color: "#005a8c", tag: "FINANCEIRO",  label: "Sicredi Foz · soluções financeiras para sua empresa" },
  { anunc: "Rafain Churrascaria", color: "#7a1f1f", tag: "GASTRONOMIA", label: "Rafain · o melhor churrasco da tríplice fronteira" },
  { anunc: "Parque das Aves",     color: "#1a6b3a", tag: "TURISMO",     label: "Parque das Aves · mais de 1.500 espécies · visite!" },
  { anunc: "Hotel Bourbon Foz",   color: "#2c3e6b", tag: "HOTELARIA",   label: "Hotel Bourbon · conforto e sofisticação em Foz" },
];

interface Props {
  height?: number;
}

export default function RotatingAd({ height = 80 }: Props) {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIdx(i => (i + 1) % AD_INVENTORY.length);
        setFading(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const c = AD_INVENTORY[idx];

  return (
    <div style={{ position: "relative" }}>
      <div style={{
        height,
        borderRadius: "var(--r-m)",
        background: c.color,
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        gap: 14,
        opacity: fading ? 0 : 1,
        transition: "opacity 0.3s ease",
        cursor: "pointer",
        overflow: "hidden",
        position: "relative",
      }}>
        <div style={{ position: "absolute", inset: 0, opacity: .07, backgroundImage: "repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)", backgroundSize: "8px 8px" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.14em", background: "rgba(255,255,255,.2)", color: "white", padding: "2px 8px", borderRadius: 3, flexShrink: 0, position: "relative" }}>
          {c.tag}
        </span>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: 500, color: "white", flex: 1, position: "relative" }}>
          {c.label}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0, position: "relative" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,.6)", fontFamily: "var(--font-mono)" }}>
            {idx + 1}/{AD_INVENTORY.length}
          </span>
          <div style={{ display: "flex", gap: 4 }}>
            {AD_INVENTORY.map((_, i) => (
              <div key={i}
                onClick={() => setIdx(i)}
                style={{ width: 6, height: 6, borderRadius: "50%", background: i === idx ? "white" : "rgba(255,255,255,.35)", cursor: "pointer", transition: "background .2s" }}
              />
            ))}
          </div>
          <span style={{ fontSize: 10, color: "rgba(255,255,255,.5)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
            publicidade
          </span>
        </div>
      </div>
    </div>
  );
}
