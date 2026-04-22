"use client";

import React, { useState } from "react";
import Link from "next/link";

const EDITORIAS: Record<string, { label: string }> = {
  cidade: { label: "Cidade" },
  politica: { label: "Política" },
  economia: { label: "Economia" },
  turismo: { label: "Turismo" },
  paraguai: { label: "Paraguai" },
  cultura: { label: "Cultura" },
  esporte: { label: "Esporte" },
  itaipu: { label: "Itaipu" },
  seguranca: { label: "Segurança" },
};

const inputStyle: React.CSSProperties = { padding: "10px 14px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 14, width: "100%", outline: "none" };
const inputSm: React.CSSProperties = { ...inputStyle, padding: "6px 10px", fontSize: 13 };

export default function ArticleEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const isNew = id === "novo";
  const [title, setTitle] = useState(isNew ? "" : "Exemplo de título da notícia");
  const [status, setStatus] = useState("Rascunho");

  return (
    <div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
        <Link href="/admin/noticias" style={{ padding: "6px 12px", background: "white", color: "#111", border: "1.5px solid #e2e8f0", borderRadius: 8, fontWeight: 600, fontSize: 12, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>← Voltar</Link>
        <div style={{ fontFamily: "DM Serif Display, Georgia, serif", fontSize: 22 }}>{isNew ? "Nova notícia" : "Editar notícia"}</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button style={{ padding: "6px 12px", background: "white", color: "#111", border: "1.5px solid #e2e8f0", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>◎ Pré-visualizar</button>
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ width: "auto", padding: "7px 12px", fontSize: 13, border: "1.5px solid #e2e8f0", borderRadius: 8, background: "white", outline: "none" }}>
            {["Rascunho", "Em revisão", "Agendado", "Publicado"].map(s => <option key={s}>{s}</option>)}
          </select>
          <button style={{ padding: "6px 12px", background: "#0a7a6b", color: "white", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Salvar</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 290px", gap: 20, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, padding: "22px 24px" }}>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título da notícia..." style={{ width: "100%", border: "none", outline: "none", fontFamily: "DM Serif Display, Georgia, serif", fontSize: 26, lineHeight: 1.2, background: "transparent", color: "#111" }} />
            <div style={{ height: 1, background: "#e2e8f0", margin: "14px 0" }} />
            <input placeholder="Lead / subtítulo (aparece no destaque da home)..." style={{ width: "100%", border: "none", outline: "none", fontSize: 16, color: "#444", fontStyle: "italic", background: "transparent" }} />
          </div>
          <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", borderBottom: "1px solid #e2e8f0", display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["B", "I", "H2", "H3", "Link", "Imagem", "Bloco", "Lista"].map(l => (
                <button key={l} style={{ padding: "4px 10px", border: "1px solid #e2e8f0", borderRadius: 6, background: "#f5f7fa", fontSize: 12, cursor: "pointer", fontWeight: l === "B" ? 700 : 400, fontStyle: l === "I" ? "italic" : "normal" }}>{l}</button>
              ))}
            </div>
            <textarea placeholder="Escreva o corpo da notícia aqui..." defaultValue={isNew ? "" : "A Prefeitura de Foz do Iguaçu divulgou nesta segunda-feira um pacote de R$ 12 milhões..."} style={{ width: "100%", minHeight: 360, padding: "22px 24px", border: "none", outline: "none", resize: "vertical", fontFamily: "Georgia,serif", fontSize: 17, lineHeight: 1.8, color: "#444", background: "transparent" }} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card title="Publicação">
            <Row label="Status">
              <select value={status} onChange={e => setStatus(e.target.value)} style={inputSm}>
                {["Rascunho", "Em revisão", "Agendado", "Publicado"].map(s => <option key={s}>{s}</option>)}
              </select>
            </Row>
            <Row label="Autor">
              <select style={inputSm}><option>Mariana Souza</option><option>Carlos Lima</option><option>Ana Ferreira</option></select>
            </Row>
            <Row label="Data e hora"><input type="datetime-local" style={inputSm} /></Row>
          </Card>
          <Card title="Categoria & Tags">
            <Row label="Categoria">
              <select style={inputSm}>{Object.entries(EDITORIAS).map(([k, v]) => <option key={k}>{v.label}</option>)}</select>
            </Row>
            <Row label="Tags"><input placeholder="separadas por vírgula" style={{ ...inputSm, fontSize: 13 }} /></Row>
          </Card>
          <Card title="Imagem de destaque">
            <div style={{ border: "2px dashed #e2e8f0", borderRadius: 8, padding: "20px", textAlign: "center", cursor: "pointer", background: "#f5f7fa" }}>
              <div style={{ fontSize: 24, color: "#888" }}>↑</div>
              <div style={{ fontSize: 13, marginTop: 8, color: "#888" }}>Upload ou arraste</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 4, fontFamily: "monospace" }}>JPG, PNG, WebP · máx 5MB</div>
            </div>
          </Card>
          <Card title="SEO">
            <Row label="Meta título"><input style={inputSm} defaultValue={title} /></Row>
            <Row label="Meta descrição"><textarea style={{ ...inputSm, resize: "none" }} rows={3} /></Row>
            <div style={{ padding: "6px 10px", background: "#f2faf9", borderRadius: 6, fontSize: 11, color: "#0a7a6b" }}>
              {title.length > 10 ? "✓ Título com boa extensão" : "✗ Título muito curto"}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ padding: "11px 16px", borderBottom: "1px solid #e2e8f0", fontSize: 13, fontWeight: 600, color: "#444" }}>{title}</div>
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 11, fontFamily: "monospace", color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 4 }}>{label}</label>
      {children}
    </div>
  );
}
