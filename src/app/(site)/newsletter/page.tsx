import { buildMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import NewsletterSignupForm from "@/components/site/NewsletterSignupForm";

export const metadata: Metadata = buildMetadata({
  title: "Newsletter — Foz em Foco",
  description: "Receba as melhores notícias de Foz do Iguaçu todo dia no seu e-mail. 14 mil assinantes.",
  path: "/newsletter",
});

const PLANS = [
  {
    id: "diaria",
    name: "Diária",
    freq: "Toda manhã · 7h",
    desc: "O resumo do dia com as 5 notícias que você precisa saber sobre Foz",
    price: "Grátis",
    cta: "Assinar grátis",
    primary: true,
  },
  {
    id: "semanal",
    name: "Semanal",
    freq: "Toda sexta · 12h",
    desc: "O melhor da semana em Foz: top notícias, eventos e oportunidades",
    price: "Grátis",
    cta: "Assinar grátis",
    primary: false,
  },
  {
    id: "guia",
    name: "Guia & Negócios",
    freq: "Toda segunda · 9h",
    desc: "Promoções do guia comercial, vagas de emprego e dicas de consumo",
    price: "Grátis",
    cta: "Assinar grátis",
    primary: false,
  },
];

const STATS = [
  { v: "14 mil",  l: "assinantes" },
  { v: "58%",     l: "taxa de abertura" },
  { v: "7 anos",  l: "de publicação" },
  { v: "0 spam",  l: "garantido" },
];

export default function NewsletterPage() {
  return (
    <>
      {/* Hero */}
      <div style={{ background: "var(--ink)", padding: "60px 0" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
            <div>
              <span style={{ background: "var(--teal)", color: "white", fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.12em", padding: "4px 12px", borderRadius: 3, display: "inline-block", marginBottom: 18 }}>
                NEWSLETTER
              </span>
              <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(36px,5vw,56px)", color: "white", lineHeight: 1.05, marginBottom: 16 }}>
                Foz no seu e-mail, todo dia de manhã
              </h1>
              <p style={{ fontSize: 17, color: "rgba(255,255,255,.65)", lineHeight: 1.7, marginBottom: 24 }}>
                14 mil moradores de Foz já recebem o resumo do dia com as notícias que importam: câmbio, pontes, obras, eventos e o que aconteceu na tríplice fronteira.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
                {STATS.map(({ v, l }) => (
                  <div key={l}>
                    <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--teal)", lineHeight: 1 }}>{v}</div>
                    <div className="t-mono" style={{ fontSize: 10, color: "rgba(255,255,255,.4)", marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signup form */}
            <div style={{ background: "white", borderRadius: "var(--r-xl)", padding: 36 }}>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 24, color: "var(--ink)", marginBottom: 6 }}>Assine agora, é grátis</div>
              <div className="t-small color-muted" style={{ marginBottom: 24 }}>Cancele quando quiser. Sem spam, prometemos.</div>
              <NewsletterSignupForm />
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="container" style={{ padding: "60px 20px" }}>
        <div className="sec-label bold" style={{ marginBottom: 24 }}>Escolha sua newsletter</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {PLANS.map((p) => (
            <div
              key={p.id}
              style={{
                background: "white", borderRadius: "var(--r-l)", padding: 28,
                border: p.primary ? "2px solid var(--teal)" : "1px solid var(--border)",
                boxShadow: p.primary ? "var(--shadow-m)" : "var(--shadow-s)",
                position: "relative",
              }}
            >
              {p.primary && (
                <div style={{ position: "absolute", top: -12, left: 24, background: "var(--teal)", color: "white", fontFamily: "var(--font-mono)", fontSize: 10, padding: "3px 12px", borderRadius: 3 }}>
                  MAIS POPULAR
                </div>
              )}
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, marginBottom: 4 }}>{p.name}</div>
              <div className="t-mono" style={{ color: "var(--teal)", fontSize: 11, marginBottom: 12 }}>{p.freq}</div>
              <p className="t-small color-muted" style={{ marginBottom: 20, lineHeight: 1.6 }}>{p.desc}</p>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 28, color: "var(--teal)", marginBottom: 16 }}>{p.price}</div>
              <button className={`btn ${p.primary ? "btn-primary" : "btn-outline"}`} style={{ width: "100%", justifyContent: "center" }}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Sample edition */}
        <div style={{ marginTop: 60 }}>
          <div className="sec-label bold" style={{ marginBottom: 20 }}>Como é uma edição típica</div>
          <div style={{ maxWidth: 640, background: "white", border: "1px solid var(--border)", borderRadius: "var(--r-l)", overflow: "hidden", boxShadow: "var(--shadow-m)" }}>
            <div style={{ background: "var(--teal)", padding: "20px 24px", color: "white" }}>
              <div className="t-mono" style={{ fontSize: 10, opacity: .6, marginBottom: 4 }}>FOZ EM FOCO · SEG 21 ABR 2026</div>
              <div style={{ fontFamily: "var(--font-serif)", fontSize: 22 }}>Bom dia, Foz! ☀️ 5 coisas para hoje</div>
            </div>
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                ["🏙 Cidade", "Prefeitura abre licitação para obra de R$ 12 mi no Centro — prazo até 30 abril"],
                ["💱 Câmbio", "Dólar a R$ 5,82 · Guarani a R$ 0,00078 · Peso ARG a R$ 0,0063"],
                ["🌡 Clima", "23°C → 31°C · Sol com nuvens · sem chuva"],
                ["🌉 Pontes", "Amizade: fluxo normal · Tancredo Neves: operação fiscal até 21h"],
                ["📅 Agenda", "Feira Gastronômica da Vila A — hoje, 18h no Gramadão · Grátis"],
              ].map(([label, text]) => (
                <div key={label} style={{ display: "flex", gap: 12, fontSize: 14, lineHeight: 1.5 }}>
                  <span style={{ flexShrink: 0 }}>{label}</span>
                  <span style={{ color: "var(--ink-2)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
