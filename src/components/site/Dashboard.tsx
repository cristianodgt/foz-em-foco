"use client";

import { useEffect, useState } from "react";
import { Thermometer, DollarSign, Droplets, Fuel, Wind } from "lucide-react";
import Link from "next/link";

interface DashboardData {
  weather: {
    temp: number;
    feels: number;
    min: number;
    max: number;
    condition: string;
    humidity: number;
  } | null;
  exchange: {
    usdBrl: { bid: string; pct: string };
    brlPyg: { bid: string; pct: string };
    usdPyg: { bid: string; pct: string };
  } | null;
  bridges: { tancredo: string; amizade: string };
  cataratas: { vazao: string | null; updatedAt: string | null };
  fuel: { gasolina: string | null; diesel: string | null; etanol: string | null };
  sponsor: { name: string | null; url: string | null };
}

const BRIDGE_COLORS: Record<string, string> = {
  livre: "text-green-400",
  moderado: "text-yellow-400",
  lento: "text-orange-400",
  fechado: "text-red-400",
};

const BRIDGE_LABELS: Record<string, string> = {
  livre: "Livre",
  moderado: "Moderado",
  lento: "Lento",
  fechado: "Fechado",
};

function PctBadge({ pct }: { pct: string }) {
  const n = parseFloat(pct);
  const up = n >= 0;
  return (
    <span className={`font-mono text-xs ${up ? "text-green-400" : "text-red-400"}`}>
      {up ? "▲" : "▼"} {Math.abs(n).toFixed(2)}%
    </span>
  );
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  const load = () =>
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});

  useEffect(() => {
    load();
    const id = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-ink text-white py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Sponsor */}
        {data?.sponsor?.name && (
          <p className="text-xs text-white/40 font-mono mb-3 text-right">
            Dashboard apresentado por{" "}
            {data.sponsor.url ? (
              <Link href={data.sponsor.url} target="_blank" className="text-teal-light hover:underline">
                {data.sponsor.name}
              </Link>
            ) : (
              <span className="text-white/60">{data.sponsor.name}</span>
            )}
          </p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Weather */}
          <div className="bg-white/5 rounded-lg p-4 border-t-2 border-blue-400">
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">Clima FOZ</p>
            {data?.weather ? (
              <>
                <p className="text-2xl font-serif font-bold">{data.weather.temp}°C</p>
                <p className="text-xs text-white/50 capitalize mt-1">{data.weather.condition}</p>
                <p className="text-xs text-white/40 font-mono mt-1">
                  {data.weather.min}° / {data.weather.max}°
                </p>
              </>
            ) : (
              <p className="text-white/30 text-sm">—</p>
            )}
          </div>

          {/* USD/BRL */}
          <div className="bg-white/5 rounded-lg p-4 border-t-2 border-green-400">
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">USD / BRL</p>
            {data?.exchange ? (
              <>
                <p className="text-2xl font-serif font-bold">R$ {data.exchange.usdBrl.bid}</p>
                <PctBadge pct={data.exchange.usdBrl.pct} />
              </>
            ) : (
              <p className="text-white/30 text-sm">—</p>
            )}
          </div>

          {/* BRL/PYG */}
          <div className="bg-white/5 rounded-lg p-4 border-t-2 border-yellow-400">
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">BRL / Guarani</p>
            {data?.exchange ? (
              <>
                <p className="text-2xl font-serif font-bold">₲{data.exchange.brlPyg.bid}</p>
                <PctBadge pct={data.exchange.brlPyg.pct} />
              </>
            ) : (
              <p className="text-white/30 text-sm">—</p>
            )}
          </div>

          {/* Ponte Tancredo */}
          <div className="bg-white/5 rounded-lg p-4 border-t-2 border-teal">
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">Ponte Tancredo</p>
            <p className={`text-xl font-bold ${BRIDGE_COLORS[data?.bridges.tancredo ?? "livre"]}`}>
              {BRIDGE_LABELS[data?.bridges.tancredo ?? "livre"]}
            </p>
            <p className="text-xs text-white/30 mt-1 font-mono">Brasil ↔ Paraguai</p>
          </div>

          {/* Ponte Amizade */}
          <div className="bg-white/5 rounded-lg p-4 border-t-2 border-purple-400">
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">Ponte Amizade</p>
            <p className={`text-xl font-bold ${BRIDGE_COLORS[data?.bridges.amizade ?? "livre"]}`}>
              {BRIDGE_LABELS[data?.bridges.amizade ?? "livre"]}
            </p>
            <p className="text-xs text-white/30 mt-1 font-mono">Brasil ↔ Paraguai</p>
          </div>

          {/* Cataratas */}
          <div className="bg-white/5 rounded-lg p-4 border-t-2 border-cyan-400">
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/40 mb-1">Cataratas</p>
            {data?.cataratas.vazao ? (
              <>
                <p className="text-xl font-serif font-bold">{data.cataratas.vazao}</p>
                <p className="text-xs text-white/30 font-mono mt-1">m³/s</p>
              </>
            ) : (
              <p className="text-white/30 text-sm">—</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
