import Link from "next/link";
import { Share2, Play, Link2, ExternalLink, Mail } from "lucide-react";

const EDITORIAS = [
  { label: "Cidade", slug: "cidade" },
  { label: "Política", slug: "politica" },
  { label: "Economia", slug: "economia" },
  { label: "Turismo", slug: "turismo" },
  { label: "Paraguai", slug: "paraguai" },
  { label: "Cultura", slug: "cultura" },
  { label: "Esporte", slug: "esporte" },
  { label: "Itaipu", slug: "itaipu" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1 — Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-teal flex items-center justify-center text-white font-bold text-sm">
                FF
              </div>
              <span className="font-serif text-lg font-bold">Foz em Foco</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              O portal de notícias e utilidade pública de Foz do Iguaçu e da tríplice fronteira.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Share2, href: "#", label: "Instagram" },
                { icon: Link2, href: "#", label: "Facebook" },
                { icon: ExternalLink, href: "#", label: "Twitter" },
                { icon: Play, href: "#", label: "YouTube" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-teal transition-colors"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Editorias */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Editorias</h4>
            <ul className="space-y-2">
              {EDITORIAS.map((e) => (
                <li key={e.slug}>
                  <Link
                    href={`/categoria/${e.slug}`}
                    className="text-sm text-white/70 hover:text-teal-light transition-colors"
                  >
                    {e.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Serviços */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Serviços</h4>
            <ul className="space-y-2">
              {[
                { label: "Guia Comercial", href: "/guia" },
                { label: "Agenda de Eventos", href: "/agenda" },
                { label: "Vagas de Emprego", href: "/empregos" },
                { label: "Newsletter", href: "/newsletter" },
                { label: "Anuncie Aqui", href: "/anuncie" },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/70 hover:text-teal-light transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contato */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">Contato</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:redacao@fozemfoco.com.br" className="flex items-center gap-2 text-sm text-white/70 hover:text-teal-light transition-colors">
                  <Mail size={14} />
                  redacao@fozemfoco.com.br
                </a>
              </li>
            </ul>
            <div className="mt-6">
              <Link
                href="/newsletter"
                className="inline-flex items-center gap-2 bg-teal text-white text-sm font-semibold px-4 py-2 rounded hover:bg-teal-dark transition-colors"
              >
                <Mail size={14} />
                Assinar newsletter
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>© {new Date().getFullYear()} Foz em Foco. Todos os direitos reservados.</span>
          <span>
            Desenvolvido por{" "}
            <a
              href="https://www.inovaefoz.com.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-teal-light transition-colors"
            >
              Inovae
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
