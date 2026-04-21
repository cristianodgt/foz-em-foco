import { prisma } from "@/lib/prisma";
import { Users, Mail } from "lucide-react";

export default async function NewsletterPage() {
  const [subscribers, editions] = await Promise.all([
    prisma.newsletterSubscriber.findMany({ where: { active: true }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.newsletterEdition.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  const total = await prisma.newsletterSubscriber.count({ where: { active: true } });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-2">Newsletter</h1>
      <p className="text-white/40 text-sm mb-8 flex items-center gap-2">
        <Users size={14} /> {total.toLocaleString()} inscritos ativos
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscribers */}
        <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
          <h2 className="text-white font-semibold text-sm mb-4">Inscritos recentes</h2>
          <div className="flex flex-col gap-2">
            {subscribers.map((s) => (
              <div key={s.id} className="flex items-center gap-3 text-sm py-1.5 border-b border-white/5">
                <div className="w-6 h-6 rounded-full bg-teal/20 flex items-center justify-center text-teal text-xs font-bold">
                  {s.email[0].toUpperCase()}
                </div>
                <span className="text-white/70 flex-1 truncate">{s.email}</span>
                <span className="text-white/30 text-xs font-mono">
                  {new Date(s.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Editions */}
        <div className="bg-gray-900 border border-white/5 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-sm">Edições enviadas</h2>
            <button className="flex items-center gap-2 bg-teal text-white text-xs px-3 py-1.5 rounded hover:bg-teal-dark transition-colors">
              <Mail size={12} /> Nova edição
            </button>
          </div>
          {editions.length > 0 ? (
            <div className="flex flex-col gap-2">
              {editions.map((e) => (
                <div key={e.id} className="flex items-center gap-3 py-1.5 border-b border-white/5">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 truncate">{e.subject}</p>
                    <p className="text-xs text-white/30 font-mono">
                      {e.sentAt ? `Enviada ${new Date(e.sentAt).toLocaleDateString("pt-BR")} · ${e.sentCount} destinatários` : "Rascunho"}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-mono ${e.sentAt ? "bg-green-900/50 text-green-400" : "bg-gray-800 text-white/30"}`}>
                    {e.sentAt ? "enviada" : "rascunho"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/30 text-sm">Nenhuma edição enviada.</p>
          )}
        </div>
      </div>
    </div>
  );
}
