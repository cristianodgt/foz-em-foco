"use client";

import { useState } from "react";
import { Mail, CheckCircle } from "lucide-react";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="bg-teal-light border border-teal/20 rounded-lg p-5">
      <div className="flex items-center gap-2 mb-2">
        <Mail size={18} className="text-teal" />
        <h3 className="font-semibold text-ink text-sm">Newsletter Foz em Foco</h3>
      </div>
      <p className="text-xs text-muted mb-3 leading-relaxed">
        As principais notícias da cidade direto no seu e-mail, todo dia.
      </p>
      {status === "done" ? (
        <div className="flex items-center gap-2 text-teal text-sm font-medium">
          <CheckCircle size={16} />
          Inscrito com sucesso!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="text-sm border border-border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal/30"
          />
          {status === "error" && <p className="text-xs text-red-500">Erro. Tente novamente.</p>}
          <button
            type="submit"
            disabled={status === "loading"}
            className="bg-teal text-white text-sm font-semibold py-2 rounded hover:bg-teal-dark transition-colors disabled:opacity-50"
          >
            {status === "loading" ? "Inscrevendo..." : "Assinar grátis"}
          </button>
        </form>
      )}
    </div>
  );
}
