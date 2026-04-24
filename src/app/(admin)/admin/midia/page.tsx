"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

const TEAL = "#0a7a6b";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";

type Media = {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  folder: string;
  altText: string | null;
  createdAt: string;
};

function formatSize(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function timeAgo(iso: string) {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "agora";
  if (diff < 3600) return `há ${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`;
  return `há ${Math.floor(diff / 86400)}d`;
}

export default function MidiaPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [items, setItems] = useState<Media[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      const res = await fetch(`/api/admin/media?${params.toString()}`);
      const data = await res.json();
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    load();
  }, [load]);

  const totalBytes = items.reduce((s, i) => s + (i.size || 0), 0);
  const imgCount = items.filter((i) => i.mimeType.startsWith("image/")).length;
  const vidCount = items.filter((i) => i.mimeType.startsWith("video/")).length;

  const kpis = [
    { label: "Total de arquivos", value: String(total), color: TEAL },
    { label: "Imagens", value: String(imgCount), color: "#1a6b5a" },
    { label: "Vídeos", value: String(vidCount), color: "#d35400" },
    { label: "Uso do storage", value: formatSize(totalBytes), color: "#065a4f" },
  ];

  const filteredItems = items.filter((i) => {
    if (typeFilter === "image" && !i.mimeType.startsWith("image/")) return false;
    if (typeFilter === "video" && !i.mimeType.startsWith("video/")) return false;
    if (typeFilter === "pdf" && i.mimeType !== "application/pdf") return false;
    return true;
  });

  async function uploadFiles(files: FileList | File[]) {
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "geral");
        const res = await fetch("/api/admin/media", { method: "POST", body: fd });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          alert(`Falha ao enviar ${file.name}: ${err.error ?? res.statusText}`);
        }
      }
      await load();
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string, filename: string) {
    if (!confirm(`Excluir "${filename}"?`)) return;
    const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("Falha ao excluir");
      return;
    }
    await load();
  }

  async function handleRename(m: Media) {
    const newName = prompt("Renomear arquivo (display):", m.filename);
    if (!newName || newName === m.filename) return;
    const res = await fetch(`/api/admin/media/${m.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: newName }),
    });
    if (res.ok) await load();
  }

  return (
    <div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,application/pdf"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files && e.target.files.length) uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {/* Hero */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>
            Biblioteca de Mídia
          </div>
          <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>
            imagens, vídeos e documentos · {total} arquivos · {formatSize(totalBytes)}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => {
              const name = prompt("Nome da nova pasta:");
              if (name) alert(`Pasta "${name}" criada. Use o filtro ao enviar novos arquivos.`);
            }}
            style={{
              padding: "9px 14px", border: `1px solid ${BORDER}`, borderRadius: 8,
              background: "white", fontSize: 13, color: INK, fontWeight: 500, cursor: "pointer",
            }}
          >
            Nova pasta
          </button>
          <button
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: "9px 16px", background: TEAL, borderRadius: 8,
              fontSize: 13, color: "white", fontWeight: 600, border: "none",
              cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.6 : 1,
            }}
          >
            {uploading ? "Enviando..." : "+ Upload"}
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
            </div>
          </div>
        ))}
      </div>

      {/* Dropzone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
        }}
        style={{
          background: dragOver ? "#f0fdf4" : "white",
          border: `2px dashed ${dragOver ? TEAL : BORDER}`, borderRadius: 14,
          padding: "28px", textAlign: "center", cursor: "pointer", marginBottom: 20,
          transition: "background .15s, border-color .15s",
        }}
      >
        <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f3f4f6", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", color: TEAL, fontSize: 22, fontFamily: "var(--font-serif)" }}>
          ↑
        </div>
        <div style={{ fontFamily: "var(--font-serif)", fontSize: 18, color: INK, marginBottom: 4 }}>
          {uploading ? "Enviando arquivos..." : "Arraste arquivos para fazer upload"}
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
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            flex: 1, padding: "9px 12px", fontSize: 13,
            border: `1px solid ${BORDER}`, borderRadius: 8, outline: "none",
            background: BG, color: INK,
          }}
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{
            padding: "9px 12px", fontSize: 13, border: `1px solid ${BORDER}`,
            borderRadius: 8, outline: "none", background: "white", color: INK,
          }}
        >
          <option value="all">Todos os tipos</option>
          <option value="image">Imagens</option>
          <option value="video">Vídeos</option>
          <option value="pdf">PDFs</option>
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

      {loading && <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED, marginBottom: 10 }}>Carregando...</div>}

      {filteredItems.length === 0 && !loading ? (
        <div style={{ background: "white", border: `1px solid ${BORDER}`, borderRadius: 14, padding: 40, textAlign: "center", color: MUTED }}>
          Nenhum arquivo encontrado. Envie seu primeiro arquivo acima.
        </div>
      ) : view === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 12 }}>
          {filteredItems.map((m) => (
            <div
              key={m.id}
              style={{
                background: "white", border: `1px solid ${BORDER}`, borderRadius: 12,
                overflow: "hidden", cursor: "pointer", position: "relative",
              }}
            >
              <div style={{ aspectRatio: "1/1", background: "#f3f4f6", position: "relative" }}>
                {m.mimeType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt={m.altText ?? m.filename} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontFamily: "var(--font-mono)", color: MUTED, fontSize: 11 }}>
                    {m.mimeType.split("/")[1]?.toUpperCase() ?? "FILE"}
                  </div>
                )}
              </div>
              <div style={{ padding: "10px 12px" }}>
                <div
                  title={m.filename}
                  onClick={() => handleRename(m)}
                  style={{ fontSize: 12, fontWeight: 500, color: INK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                >
                  {m.filename}
                </div>
                <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: MUTED, textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{formatSize(m.size)}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(m.id, m.filename); }}
                    style={{ border: "none", background: "transparent", color: "#c0392b", fontFamily: "var(--font-mono)", fontSize: 10, cursor: "pointer", fontWeight: 700 }}
                  >
                    excluir
                  </button>
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
                {["Arquivo", "Tipo", "Tamanho", "Pasta", "Upload", ""].map((h, i) => (
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
              {filteredItems.map((m, i) => (
                <tr key={m.id} style={{ borderTop: i > 0 ? `1px solid ${BORDER}` : "none" }}>
                  <td style={{ padding: "14px", fontSize: 13, color: INK, fontWeight: 500 }}>
                    <a href={m.url} target="_blank" rel="noreferrer" style={{ color: INK, textDecoration: "none" }}>{m.filename}</a>
                  </td>
                  <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>{m.mimeType}</td>
                  <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>{formatSize(m.size)}</td>
                  <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>{m.folder}</td>
                  <td style={{ padding: "14px", fontFamily: "var(--font-mono)", fontSize: 12, color: MUTED }}>{timeAgo(m.createdAt)}</td>
                  <td style={{ padding: "14px", textAlign: "right" }}>
                    <button
                      onClick={() => handleDelete(m.id, m.filename)}
                      style={{ border: `1px solid ${BORDER}`, background: "white", color: "#c0392b", fontFamily: "var(--font-mono)", fontSize: 11, padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontWeight: 600 }}
                    >
                      excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
