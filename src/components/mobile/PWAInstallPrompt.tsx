"use client";
import { useEffect, useState } from "react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const VISITS_KEY = "fef-visits";
const DISMISS_KEY = "fef-pwa-dismissed-at";
const DISMISS_DAYS = 7;

export default function PWAInstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Increment visits once per session
    try {
      if (!sessionStorage.getItem("fef-visit-counted")) {
        const v = parseInt(localStorage.getItem(VISITS_KEY) || "0", 10) + 1;
        localStorage.setItem(VISITS_KEY, String(v));
        sessionStorage.setItem("fef-visit-counted", "1");
      }
    } catch {}

    const handler = (e: Event) => {
      e.preventDefault();
      const bip = e as BIPEvent;
      setDeferred(bip);

      try {
        const visits = parseInt(localStorage.getItem(VISITS_KEY) || "0", 10);
        const dismissedAt = parseInt(localStorage.getItem(DISMISS_KEY) || "0", 10);
        const dismissValid =
          dismissedAt && Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
        if (visits >= 3 && !dismissValid) setShow(true);
      } catch {
        setShow(true);
      }
    };

    const manualHandler = () => {
      if (deferred) {
        setShow(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("pwa-install-request", manualHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("pwa-install-request", manualHandler);
    };
  }, [deferred]);

  async function install() {
    if (!deferred) return;
    try {
      await deferred.prompt();
      await deferred.userChoice;
    } catch {}
    setDeferred(null);
    setShow(false);
  }

  function dismiss() {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch {}
    setShow(false);
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Instalar aplicativo"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
      onClick={dismiss}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white",
          borderRadius: "16px 16px 0 0",
          padding: "20px 16px calc(24px + env(safe-area-inset-bottom))",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ width: 40, height: 4, background: "#e2e8f0", borderRadius: 2, margin: "0 auto 16px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#0a7a6b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="36" height="36" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="13" fill="none" stroke="white" strokeWidth="2" opacity="0.4" />
              <circle cx="16" cy="16" r="8" fill="none" stroke="white" strokeWidth="2" opacity="0.7" />
              <circle cx="16" cy="16" r="3" fill="white" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 20, color: "#111" }}>Foz em Foco</div>
            <div style={{ fontSize: 12, color: "#888" }}>fozemfoco.com.br</div>
          </div>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: "12px 0 18px" }}>
          {["Funciona offline", "Ícone no celular", "Leve e rápido"].map((b) => (
            <li key={b} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0", fontSize: 14, color: "#333" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a7a6b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12l5 5L20 7" />
              </svg>
              {b}
            </li>
          ))}
        </ul>

        <button
          onClick={install}
          style={{
            width: "100%",
            background: "#0a7a6b",
            color: "white",
            border: "none",
            padding: "14px 16px",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: 8,
            minHeight: 48,
          }}
        >
          Adicionar à tela inicial
        </button>
        <button
          onClick={dismiss}
          style={{
            width: "100%",
            background: "transparent",
            color: "#555",
            border: "none",
            padding: "12px 16px",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            minHeight: 44,
          }}
        >
          Agora não
        </button>
      </div>
    </div>
  );
}
