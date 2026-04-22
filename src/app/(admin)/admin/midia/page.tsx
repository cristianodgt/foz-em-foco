"use client";

import React from "react";

export default function MidiaPage() {
  return (
    <div>
      <div style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: 26, marginBottom: 20 }}>Biblioteca de Mídia</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="Buscar arquivos..." style={{ width: 220, padding: "7px 12px", fontSize: 13, border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none" }} />
          <select style={{ width: "auto", padding: "7px 12px", fontSize: 13, border: "1.5px solid #e2e8f0", borderRadius: 8, outline: "none", background: "white" }}>
            <option>Todos os tipos</option><option>Imagens</option><option>Vídeos</option><option>PDFs</option>
          </select>
        </div>
        <button style={{ padding: "6px 12px", background: "#0a7a6b", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>↑ Upload</button>
      </div>
      <div style={{ border: "2px dashed #e2e8f0", borderRadius: 12, padding: "28px", textAlign: "center", marginBottom: 20, cursor: "pointer", background: "white" }}>
        <div style={{ fontSize: 28, color: "#888" }}>↑</div>
        <div style={{ fontWeight: 600, marginTop: 10, marginBottom: 4 }}>Arraste arquivos para fazer upload</div>
        <div style={{ fontSize: 13, color: "#888" }}>JPG, PNG, WebP, MP4, PDF · máx 50MB por arquivo</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ aspectRatio: "1/1", background: "#dde2e8", backgroundImage: "linear-gradient(135deg,#dde2e8 25%,#cdd2d8 25%,#cdd2d8 50%,#dde2e8 50%,#dde2e8 75%,#cdd2d8 75%)", backgroundSize: "12px 12px" }} />
            <div style={{ padding: "7px 10px" }}>
              <div style={{ fontSize: 11, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>foto-{i + 1}.jpg</div>
              <div style={{ fontSize: 10, fontFamily: "monospace", color: "#888" }}>1.2MB · 1920×1080</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
