"use client";

import { useState } from "react";

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
    <div style={{ background: "var(--teal)", borderRadius: "var(--r-l)", padding: 20, color: "white" }}>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, opacity: .8, letterSpacing: "0.1em", marginBottom: 6 }}>
        NEWSLETTER · TODA MANHÃ 7H
      </div>
      <div style={{ fontFamily: "var(--font-serif)", fontSize: 22, marginBottom: 8, lineHeight: 1.2 }}>
        Foz em 5 minutos no seu e-mail
      </div>
      <div style={{ fontSize: 13, opacity: .9, marginBottom: 14 }}>
        14.847 inscritos · 58% de abertura · sem spam
      </div>
      {status === "done" ? (
        <div style={{ fontSize: 14, fontWeight: 600, color: "white" }}>✓ Inscrito com sucesso!</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            style={{ marginBottom: 8, background: "rgba(255,255,255,.15)", border: "1.5px solid rgba(255,255,255,.4)", color: "white" }}
          />
          {status === "error" && (
            <div style={{ fontSize: 12, color: "rgba(255,255,255,.8)", marginBottom: 6 }}>Erro. Tente novamente.</div>
          )}
          <button
            type="submit"
            disabled={status === "loading"}
            className="btn"
            style={{ width: "100%", justifyContent: "center", background: "white", color: "var(--teal)", fontWeight: 700 }}
          >
            {status === "loading" ? "Inscrevendo..." : "Inscrever grátis →"}
          </button>
        </form>
      )}
    </div>
  );
}
