"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, FileText, Image, Tag, Users, MessageSquare,
  MapPin, Megaphone, Mail, Calendar, Briefcase, Settings, LogOut,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Notícias", href: "/admin/noticias", icon: FileText },
  { label: "Mídia", href: "/admin/midia", icon: Image },
  { label: "Categorias", href: "/admin/categorias", icon: Tag },
  { label: "Autores", href: "/admin/autores", icon: Users },
  { label: "Comentários", href: "/admin/comentarios", icon: MessageSquare },
  { label: "Guia Comercial", href: "/admin/guia", icon: MapPin },
  { label: "Anúncios", href: "/admin/anuncios", icon: Megaphone },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Agenda", href: "/admin/agenda", icon: Calendar },
  { label: "Empregos", href: "/admin/empregos", icon: Briefcase },
  { label: "Configurações", href: "/admin/configuracoes", icon: Settings },
];

interface Props {
  user: { name?: string; email?: string; image?: string; role?: string };
}

export default function AdminSidebar({ user }: Props) {
  const path = usePathname();

  return (
    <aside className="w-60 bg-gray-900 border-r border-white/5 flex flex-col shrink-0 min-h-screen">
      {/* Brand */}
      <div className="p-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal flex items-center justify-center text-white font-bold text-xs">FF</div>
          <div>
            <p className="text-white text-sm font-semibold leading-none">Foz em Foco</p>
            <p className="text-white/30 text-xs">Painel Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = path === href || (href !== "/admin" && path.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-teal/20 text-teal-light font-medium"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 text-xs font-bold">
            {user.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/80 text-xs font-medium truncate">{user.name ?? "Admin"}</p>
            <p className="text-white/30 text-xs truncate">{user.role ?? "editor"}</p>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors"
        >
          <LogOut size={14} />
          Sair
        </button>
      </div>
    </aside>
  );
}
