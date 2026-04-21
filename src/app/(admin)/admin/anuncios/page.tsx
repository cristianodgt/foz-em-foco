import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Calendar } from "lucide-react";

export default async function AnunciosPage() {
  const advertisers = await prisma.advertiser.findMany({
    include: { campaigns: { include: { creatives: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Anúncios</h1>
        <Link href="/admin/anuncios/novo" className="flex items-center gap-2 bg-teal text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-teal-dark transition-colors">
          <Plus size={16} /> Novo anunciante
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {advertisers.map((adv) => {
          const active = adv.campaigns.filter((c) => c.active && new Date(c.endDate) >= new Date());
          const totalCreatives = adv.campaigns.reduce((s, c) => s + c.creatives.length, 0);

          return (
            <div key={adv.id} className="bg-gray-900 border border-white/5 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-white font-semibold">{adv.name}</h3>
                  <p className="text-xs text-white/40 font-mono mt-0.5">{adv.segment} · {adv.email}</p>
                </div>
                <div className="flex gap-2 text-xs font-mono">
                  <span className="bg-blue-900/50 text-blue-400 px-2 py-0.5 rounded">{active.length} campanha(s) ativa(s)</span>
                  <span className="bg-gray-800 text-white/40 px-2 py-0.5 rounded">{totalCreatives} criativos</span>
                </div>
              </div>

              {adv.campaigns.length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                  {adv.campaigns.map((c) => {
                    const isActive = c.active && new Date(c.endDate) >= new Date();
                    return (
                      <div key={c.id} className="flex items-center gap-3 text-sm border-t border-white/5 pt-2">
                        <Calendar size={12} className="text-white/30" />
                        <span className="text-white/60">{c.name}</span>
                        <span className="text-white/30 font-mono text-xs">
                          {new Date(c.startDate).toLocaleDateString("pt-BR")} — {new Date(c.endDate).toLocaleDateString("pt-BR")}
                        </span>
                        <span className={`ml-auto text-xs px-2 py-0.5 rounded font-mono ${isActive ? "bg-green-900/50 text-green-400" : "bg-gray-800 text-white/30"}`}>
                          {isActive ? "ativo" : "encerrado"}
                        </span>
                        <span className="text-xs text-white/30">{c.creatives.length} criativos</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {advertisers.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <p className="text-4xl mb-3">📢</p>
            <p>Nenhum anunciante cadastrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
