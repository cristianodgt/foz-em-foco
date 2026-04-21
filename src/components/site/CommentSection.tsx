"use client";

import { useState } from "react";
import { MessageSquare, CheckCircle } from "lucide-react";

interface Comment {
  id: string;
  name: string;
  body: string;
  createdAt: Date;
}

interface Props {
  articleId: string;
  comments: Comment[];
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}

export default function CommentSection({ articleId, comments }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, name, email, body }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="mt-10 pt-8 border-t border-border">
      <h2 className="flex items-center gap-2 font-serif text-xl font-bold text-ink mb-6">
        <MessageSquare size={20} className="text-teal" />
        Comentários ({comments.length})
      </h2>

      {comments.length > 0 && (
        <div className="flex flex-col gap-5 mb-8">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-light flex items-center justify-center text-teal font-bold text-sm shrink-0">
                {c.name[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-semibold text-sm text-ink">{c.name}</span>
                  <span className="text-xs text-muted font-mono">{formatDate(c.createdAt)}</span>
                </div>
                <p className="text-sm text-ink-2 leading-relaxed">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      <div className="bg-paper border border-border rounded-lg p-6">
        <h3 className="font-semibold text-ink mb-4">Deixe seu comentário</h3>
        {status === "done" ? (
          <div className="flex items-center gap-2 text-teal text-sm font-medium py-4">
            <CheckCircle size={16} />
            Comentário enviado! Aguarda moderação.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome *"
                className="text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail * (não publicado)"
                className="text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
            </div>
            <textarea
              required
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Escreva seu comentário..."
              className="text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/30 resize-none"
            />
            {status === "error" && <p className="text-xs text-red-500">Erro ao enviar. Tente novamente.</p>}
            <button
              type="submit"
              disabled={status === "loading"}
              className="self-start bg-teal text-white text-sm font-semibold px-5 py-2 rounded hover:bg-teal-dark transition-colors disabled:opacity-50"
            >
              {status === "loading" ? "Enviando..." : "Enviar comentário"}
            </button>
            <p className="text-xs text-muted">Comentários são moderados antes de publicar.</p>
          </form>
        )}
      </div>
    </section>
  );
}
