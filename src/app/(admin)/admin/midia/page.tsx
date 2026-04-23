"use client";

import React, { useState } from "react";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

export default function MidiaPage() {
  const [view, setView] = useState<"grid" | "list">("grid");

  const kpis = [
    { label: "Total de arquivos", value: "2.147", color: TEAL },
    { label: "Imagens", value: "1.842", color: "#1a6b5a" },
    { label: "Vídeos", value: "86", color: "#d35400" },
    { label: "Uso do storage", value: "4.2", suffix: "GB", color: "#065a4f" },
  ];

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      {/* Hero */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>
            Biblioteca de Mídia
          </div>
          <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>
            imagens, vídeos e documentos · 2.147 arquivos · 4.2 GB
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{
            padding: "9px 14px", border: `1px solid ${BORDER}`, borderRadius: 8,
            background: "white", fontSize: 13, color: INK, fontWeight: 500, cursor: "pointer",
          }}>
            Nova pasta
          </button>
          <button style={{
            padding: "9px 16px", background: TEAL, borderRadius: 8,
            fontSize: 13, color: "white", fontWeight: 600, border: "none", cursor: "pointer",
          }}>
            + Upload
          </button>
        </div>
      </div>

      {/* KPI */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{
            background: "white", border: `1px solid ${BORDER}`, borderRadius: 14,
            padding: "18px 20px", position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: 3, height: "100%", background: k.color }} />
            <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 10 }}>{k.label}</div>
            <div style={{ fontFamily: "var(--font-serif)", fontSize: 30, lineHeight: 1, color: INK }}>
              {k.value}
              {k.suffix && <span style={{ fontSize: 14, color: MUTED, marginLeft: 4 }}>{k.suffix}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Dropzone */}
      <div style={{
        background: "white", border: `2px dashed ${BORDER}`, borderRadius: 14,
        padding: "28px", textAlign: "center", cursor: "pointer", marginBottom: 20,
      }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f3f4f6", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", color: TEAL, fontSize: 22, fontFamily: "var(--font-serif)" }}>
          ↑
        </div>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: INK, marginBottom: 4 }}>
          Arraste arquivos para fazer upload
        </div>
        <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          JPG, PNG, WEBP, MP4, PDF · máx 50MB por arquivo
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        background: "white", border: `1px solid ${BORDER}`, borderRadius: 10,
        padding: "12px 16px", display: "flex", gap: 10, alignItems: "center", marginBottom: 16,
      }}>
        <input
          placeholder="Buscar arquivos..."
          style={{
            flex: 1, padding: "9px 12px", fontSize: 13,
            border: `1px solid ${BORDER}`, borderRadius: 8, outline: "none",
            background: BG, color: INK,
          }}
        />
        <select style={{
          padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`,
          borderRadius: 8, outline: "none", background: "white", color: INK,
        }}>
          <option>Todos os tipos</option>
          <option>Imagens</option>
          <option>Vídeos</option>
          <option>PDFs</option>
        </select>
        <div style={{ display: "flex", gap: 4, background: BG, padding: 4, borderRadius: 8 }}>
          {(["grid", "list"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: "6px 12px", fontSize: 12, fontWeight: 600,
                border: "none", borderRadius: 6, cursor: "pointer",
                background: view === v ? "white" : "transparent",
                color: view === v ? INK : MUTED,
                boxShadow: view === v ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                textTransform: "uppercase", letterSpacing: "0.06em",
                fontFamily: "var(--font-mono)",
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {view === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} style={{
              background: "white", border: `1px solid ${BORDER}`, borderRadius: 12,
              overflow: "hidden", cursor: "pointer",
            }}>
              <div style={{
                aspectRatio: "1/1",
                background: "#f3f4f6",
                backgroundImage: "linear-gradient(135deg,#e5e7eb 25%,#f3f4f6 25%,#f3f4f6 50%,#e5e7eb 50%,#e5e7eb 75%,#f3f4f6 75%)",
                backgroundSize: "12px 12px",
              }} />
              <div style={{ padding: "10px 12px" }}>
                <div style={{ fontSize: 12, fontWeight: 500, color: INK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  foto-{i + 1}.jpg
                </div>
                <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>
                  1.2MB · 1920×1080
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: BG }}>
                {["Arquivo", "Tipo", "Tamanho", "Dimensões", "Upload"].map((h, i) => (
                  <th key={i} style={{
                    padding: "10px 14px", fontSize: 11, fontFamily: "var(--font-mono)",
                    color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em",
                    textAlign: "left", fontWeight: 600,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 18 }).map((_, i) => (
                <tr key={i} style={{ borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                  <td style={{ padding: "14px", fontSize: 13, color: INK, fontWeight: 500 }}>foto-{i + 1}.jpg</td>
                  <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>image/jpeg</td>
                  <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>1.2 MB</td>
                  <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>1920×1080</td>
                  <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>há {i + 1}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
