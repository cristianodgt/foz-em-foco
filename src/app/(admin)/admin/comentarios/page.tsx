"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";

interface Comment {
  id: string;
  name: string;
  email: string;
  body: string;
  status: string;
  createdAt: string;
  article: { title: string; slug: string; category: { slug: string } };
}

export default function ComentariosPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState("pendente");

  const load = () =>
    fetch(`/api/comments?status=${filter}`)
      .then((r) => r.json())
      .then(setComments)
      .catch(() => {});

  useEffect(() => { load(); }, [filter]);

  const update = async (id: string, status: string) => {
    await fetch(`/api/comments/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    setComments((c) => c.filter((x) => x.id !== id));
  };

  const remove = async (id: string) => {
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    setComments((c) => c.filter((x) => x.id !== id));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Comentários</h1>

      <div className="flex gap-2 mb-6">
        {["pendente", "aprovado", "rejeitado", "spam"].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors ${filter === s ? "bg-teal text-white border-teal" : "border-white/10 text-white/40 hover:text-white/70"}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {comments.map((c) => (
          <div key={c.id} className="bg-gray-900 border border-white/5 rounded-xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/40 font-mono mb-1">{c.name} · {c.email} · {new Date(c.createdAt).toLocaleDateString("pt-BR")}</p>
                <p className="text-sm text-white/80 mb-2">{c.body}</p>
                <p className="text-xs text-white/30">Em: {c.article?.title}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                {c.status === "pendente" && (
                  <button onClick={() => update(c.id, "aprovado")} className="text-green-400 hover:text-green-300 transition-colors" title="Aprovar">
                    <CheckCircle size={18} />
                  </button>
                )}
                <button onClick={() => update(c.id, "rejeitado")} className="text-yellow-400 hover:text-yellow-300 transition-colors" title="Rejeitar">
                  <XCircle size={18} />
                </button>
                <button onClick={() => remove(c.id)} className="text-red-400 hover:text-red-300 transition-colors" title="Excluir">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-white/30 text-sm text-center py-10">Nenhum comentário com status "{filter}".</p>
        )}
      </div>
    </div>
  );
}
