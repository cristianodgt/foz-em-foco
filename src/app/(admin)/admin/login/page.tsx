"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    if (res?.ok) {
      router.push("/admin");
    } else {
      setError("E-mail ou senha inválidos.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center text-white font-bold">FF</div>
          <span className="font-serif text-xl font-bold text-white">Foz em Foco</span>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 border border-white/10 rounded-xl p-7 flex flex-col gap-4">
          <h1 className="text-white font-semibold text-lg text-center">Entrar no Painel</h1>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/50 font-mono">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-teal/50"
              placeholder="admin@fozemfoco.com.br"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-white/50 font-mono">Senha</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-teal/50"
            />
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-teal text-white font-semibold py-2.5 rounded hover:bg-teal-dark transition-colors disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
