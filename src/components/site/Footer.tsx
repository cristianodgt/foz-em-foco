import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "var(--ink)", color: "rgba(255,255,255,.75)", marginTop: 60 }}>
      <div className="container" style={{ padding: "48px 20px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1.5fr", gap: 32, marginBottom: 40 }}>

          {/* Brand */}
          <div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 26, color: "white", marginBottom: 8 }}>
              Foz <span style={{ color: "var(--teal-mid)" }}>em</span> Foco
            </div>
            <div style={{ fontSize: 14, opacity: .7, maxWidth: 260, lineHeight: 1.6, marginBottom: 16 }}>
              Jornalismo local, utilidade pública e o que acontece na tríplice fronteira.
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["App", "Podcast", "Newsletter", "RSS"].map(t => (
                <span key={t} className="pill" style={{ background: "rgba(255,255,255,.1)", borderColor: "rgba(255,255,255,.2)", color: "rgba(255,255,255,.75)", fontSize: 12 }}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Editorial */}
          <div>
            <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 14 }}>
              Editorial
            </div>
            {["Cidade", "Política", "Economia", "Turismo", "Paraguai", "Cultura", "Esporte"].map(item => (
              <div key={item} style={{ fontSize: 14, padding: "4px 0" }}>
                <Link href={`/categoria/${item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`} style={{ color: "rgba(255,255,255,.75)" }}>
                  {item}
                </Link>
              </div>
            ))}
          </div>

          {/* Produtos */}
          <div>
            <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 14 }}>
              Produtos
            </div>
            {[
              ["Guia Comercial", "/guia"],
              ["Agenda", "/agenda"],
              ["Empregos", "/empregos"],
              ["Classificados", "/classificados"],
              ["Newsletter", "/newsletter"],
            ].map(([label, href]) => (
              <div key={href} style={{ fontSize: 14, padding: "4px 0" }}>
                <Link href={href} style={{ color: "rgba(255,255,255,.75)" }}>{label}</Link>
              </div>
            ))}
          </div>

          {/* Empresa */}
          <div>
            <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 14 }}>
              Empresa
            </div>
            {["Sobre nós", "Equipe", "Ética", "Contato", "Trabalhe conosco"].map(item => (
              <div key={item} style={{ fontSize: 14, padding: "4px 0", color: "rgba(255,255,255,.75)" }}>{item}</div>
            ))}
          </div>

          {/* Anuncie */}
          <div>
            <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 14 }}>
              Anuncie
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.8, opacity: .8 }}>
              <div>Formatos e planos</div>
              <div>Mídia Kit (PDF)</div>
              <div>Falar com consultor</div>
            </div>
            <Link href="/anuncie" className="btn btn-primary btn-sm" style={{ marginTop: 16, display: "inline-flex" }}>
              Ver planos →
            </Link>
            <div style={{ marginTop: 8 }}>
              <Link href="/admin" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "1.5px solid rgba(255,255,255,.2)", borderRadius: "var(--r-m)",
                color: "rgba(255,255,255,.5)", fontSize: 13, padding: "6px 14px",
                marginTop: 6, width: "100%", textAlign: "center",
              }}>
                Admin ⚙
              </Link>
            </div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, fontSize: 12, opacity: .5 }}>
          <span>© {new Date().getFullYear()} Foz em Foco · Todos os direitos reservados</span>
          <span>Privacidade · Termos · Cookies · Anúncios</span>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.06)", marginTop: 16, paddingTop: 14, textAlign: "center", fontSize: 11, color: "rgba(255,255,255,.25)", fontFamily: "var(--font-mono)" }}>
          Desenvolvido por{" "}
          <a href="https://www.inovaefoz.com.br/" target="_blank" rel="noopener noreferrer" style={{ color: "rgba(255,255,255,.45)", fontWeight: 600 }}>
            Inovae
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
