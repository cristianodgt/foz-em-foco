"use client";
import { useEffect, useState } from "react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const VISITS_KEY = "fef-visits";
const DISMISS_KEY = "fef-pwa-dismissed-at";
const DISMISS_DAYS = 7;

const teal = "#0a7a6b";
const tealPale = "#e6f4f2";
const muted = "#888";

export default function PWAInstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem("fef-visit-counted")) {
        const v =
          parseInt(localStorage.getItem(VISITS_KEY) || "0", 10) + 1;
        localStorage.setItem(VISITS_KEY, String(v));
        sessionStorage.setItem("fef-visit-counted", "1");
      }
    } catch {}

    const handler = (e: Event) => {
      e.preventDefault();
      const bip = e as BIPEvent;
      setDeferred(bip);

      try {
        const visits = parseInt(
          localStorage.getItem(VISITS_KEY) || "0",
          10
        );
        const dismissedAt = parseInt(
          localStorage.getItem(DISMISS_KEY) || "0",
          10
        );
        const dismissValid =
          dismissedAt &&
          Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
        if (visits >= 3 && !dismissValid) setShow(true);
      } catch {
        setShow(true);
      }
    };

    const manualHandler = () => {
      setShow(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("pwa-install-request", manualHandler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("pwa-install-request", manualHandler);
    };
  }, []);

  async function install() {
    if (deferred) {
      try {
        await deferred.prompt();
        await deferred.userChoice;
      } catch {}
      setDeferred(null);
    }
    setShow(false);
  }

  function dismiss() {
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
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
        {/* Handle bar */}
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: "#ddd",
            margin: "0 auto 16px",
          }}
        />

        {/* Icon + title */}
        <div
          style={{
            display: "flex",
            gap: 14,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: teal,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="36" height="36" viewBox="0 0 32 32">
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="white"
                strokeWidth="2"
              />
              <circle
                cx="16"
                cy="16"
                r="8"
                fill="none"
                stroke="white"
                strokeWidth="2"
              />
              <circle cx="16" cy="16" r="3" fill="white" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 22,
                lineHeight: 1.1,
                marginBottom: 4,
              }}
            >
              Foz em Foco
            </div>
            <div style={{ fontSize: 12, color: muted }}>
              fozemfoco.com.br
            </div>
          </div>
        </div>

        <div
          style={{
            fontSize: 14,
            color: "#333",
            lineHeight: 1.5,
            marginBottom: 16,
          }}
        >
          Adicione Foz em Foco na tela inicial para acesso rápido às notícias,
          câmbio e status das pontes.
        </div>

        {/* Benefits */}
        <div style={{ marginBottom: 20 }}>
          {(
            [
              ["Funciona offline", "Últimas notícias mesmo sem internet"],
              ["Ícone no celular", "Abre como app, sem barra de endereço"],
              ["Leve e rápido", "Apenas 200KB — instala em 1 segundo"],
            ] as [string, string][]
          ).map(([t, d]) => (
            <div
              key={t}
              style={{
                display: "flex",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: tealPale,
                  color: teal,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{t}</div>
                <div
                  style={{
                    fontSize: 11,
                    color: muted,
                    marginTop: 1,
                  }}
                >
                  {d}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={install}
          style={{
            width: "100%",
            padding: 14,
            background: teal,
            color: "white",
            border: "none",
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 700,
            marginBottom: 8,
            cursor: "pointer",
          }}
        >
          Adicionar à tela inicial
        </button>
        <button
          onClick={dismiss}
          style={{
            width: "100%",
            padding: 10,
            background: "transparent",
            color: muted,
            border: "none",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Agora não
        </button>
      </div>
    </div>
  );
}
