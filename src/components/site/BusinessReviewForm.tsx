"use client";

import { useState } from "react";
import { Star, CheckCircle } from "lucide-react";

export default function BusinessReviewForm({ businessId }: { businessId: string }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/guia/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, name, rating, body }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="flex items-center gap-2 text-teal text-sm font-medium py-4">
        <CheckCircle size={16} /> Avaliação enviada! Aguarda aprovação.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-paper border border-border rounded-lg p-5 flex flex-col gap-3">
      <h3 className="font-semibold text-ink">Avaliar este estabelecimento</h3>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
          <button key={s} type="button" onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)} onClick={() => setRating(s)}>
            <Star size={24} className={s <= (hover || rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
          </button>
        ))}
      </div>

      <input
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Seu nome *"
        className="text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/30"
      />
      <textarea
        rows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Comentário (opcional)"
        className="text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/30 resize-none"
      />
      {status === "error" && <p className="text-xs text-red-500">Erro ao enviar.</p>}
      <button
        type="submit"
        disabled={status === "loading" || !rating}
        className="self-start bg-teal text-white text-sm font-semibold px-4 py-2 rounded hover:bg-teal-dark transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Enviando..." : "Enviar avaliação"}
      </button>
    </form>
  );
}
