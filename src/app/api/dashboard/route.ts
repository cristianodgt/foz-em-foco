import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

async function fetchWeather() {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=Foz+do+Iguacu,BR&appid=${key}&units=metric&lang=pt_br`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      temp: Math.round(data.main.temp),
      feels: Math.round(data.main.feels_like),
      min: Math.round(data.main.temp_min),
      max: Math.round(data.main.temp_max),
      condition: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
    };
  } catch {
    return null;
  }
}

async function fetchExchange() {
  try {
    const res = await fetch(
      "https://economia.awesomeapi.com.br/json/last/USD-BRL,BRL-PYG,USD-PYG",
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      usdBrl: {
        bid: parseFloat(data.USDBRL.bid).toFixed(2),
        pct: parseFloat(data.USDBRL.pctChange).toFixed(2),
      },
      brlPyg: {
        bid: parseFloat(data.BRLPYG.bid).toFixed(0),
        pct: parseFloat(data.BRLPYG.pctChange).toFixed(2),
      },
      usdPyg: {
        bid: parseFloat(data.USDPYG.bid).toFixed(0),
        pct: parseFloat(data.USDPYG.pctChange).toFixed(2),
      },
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const [weather, exchange, config] = await Promise.all([
    fetchWeather(),
    fetchExchange(),
    prisma.siteConfig.findFirst().catch(() => null),
  ]);

  return NextResponse.json(
    {
      weather,
      exchange,
      bridges: {
        tancredo: config?.bridgeTancredo ?? "livre",
        amizade: config?.bridgeAmizade ?? "livre",
      },
      cataratas: {
        vazao: config?.cataratosVazao ?? null,
        updatedAt: config?.cataratosUpdatedAt ?? null,
      },
      sponsor: {
        name: config?.dashboardSponsor ?? null,
        url: config?.dashboardSponsorUrl ?? null,
      },
      fuel: {
        gasolina: null,
        diesel: null,
        etanol: null,
      },
    },
    {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" },
    }
  );
}
