"use client";

import { useState } from "react";

export default function NewsletterSignupForm() {
  const [email, setEmail] = useState("");
  const [name, setName]   = useState("");
  const [sent, setSent]   = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, marginBottom: 6 }}>Confirmado!</div>
        <div className="t-small color-muted">Verifique seu e-mail para confirmar a assinatura.</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input
        className="input"
        type="text"
        placeholder="Seu nome"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        className="input"
        type="email"
        placeholder="seu@email.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={loading}
        style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: 15, fontWeight: 700 }}
      >
        {loading ? "Enviando…" : "Assinar gratuitamente →"}
      </button>
      <p style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", fontFamily: "var(--font-mono)" }}>
        Sem spam. Cancele quando quiser.
      </p>
    </form>
  );
}
