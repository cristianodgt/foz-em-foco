# Admin Design System — Padrão a seguir

Base: `src/app/(admin)/admin/page.tsx` (dashboard já redesenhado no commit b5ed9fa)

## Tokens (inline styles, sem Tailwind)
```ts
const TEAL = "#0a7a6b";
const TEAL_DARK = "#065a4f";
const INK = "#111";
const MUTED = "#6b7280";
const BORDER = "#e5e7eb";
const BG = "#fafaf8";
```

## Tipografia
- Títulos de seção/hero: `fontFamily: "var(--font-serif)"` (DM Serif Display)
- Labels/códigos/números: `fontFamily: "var(--font-mono)"` (JetBrains Mono)
- Corpo: default (Outfit)
- Labels em mono são SEMPRE `textTransform: uppercase, letterSpacing: 0.06-0.08em, fontSize: 11, color: MUTED`

## Container
Todo page usa:
```tsx
<div style={{ background: BG, minHeight: "100vh", padding: "24px 28px" }}>
```

## Hero pattern (topo de cada página)
```tsx
<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
  <div>
    <div style={{ fontFamily: "var(--font-serif)", fontSize: 32, color: INK, lineHeight: 1.1, marginBottom: 4 }}>
      {TÍTULO DA PÁGINA}
    </div>
    <div style={{ fontSize: 13, color: MUTED, fontFamily: "var(--font-mono)" }}>
      {SUBTÍTULO/BREADCRUMB/COUNT}
    </div>
  </div>
  <div style={{ display: "flex", gap: 10 }}>
    {/* outline secundário */}
    <button/Link estilo branco com border BORDER, 9/14, fontSize 13 />
    {/* primário teal */}
    <Link background TEAL, white, 9/16, fontWeight 600 />
  </div>
</div>
```

## Cards
- Todo card: `background: "white", border: "1px solid " + BORDER, borderRadius: 14`
- Padding interno: `22px 24px` (padrão) ou `16px 22px` (header de tabela)
- Header interno com borderBottom BORDER quando há conteúdo abaixo

## KPI Row (opcional por página)
Grid 4 colunas de cards com:
- barra lateral colorida 3px na esquerda
- label mono uppercase + trend badge (pill verde/vermelho com ArrowUp/Down)
- número grande serif (30px)
- sparkline SVG 90x28 no canto direito

## Botões
- Primário: `background: TEAL, color: white, borderRadius: 8, padding: 9px 16px, fontSize: 13, fontWeight: 600`
- Outline: `background: white, border: 1px solid BORDER, color: INK, fontWeight: 500`
- Ghost pequeno: `background: transparent, color: TEAL, fontSize: 12, fontWeight: 600`
- Destrutivo: `background: transparent, color: #b91c1c, border: 1px solid #fecaca`

## Tabelas
- `thead > tr`: `background: BG`
- `th`: `padding: 10px 14px, fontSize: 11, fontFamily: mono, color: MUTED, textTransform: uppercase, letterSpacing: 0.06em, fontWeight: 600, textAlign: left`
- `td`: `padding: 14px, fontSize: 13, color: INK`
- Linhas com `borderTop: 1px solid BORDER` (exceto primeira)
- Números em `fontFamily: mono`
- Categorias usando `<span className="cat-tag {slug-sem-acento}">{nome}</span>`

## Badges/pills de status
```tsx
<span style={{
  fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700,
  padding: "3px 8px", borderRadius: 99,
  background: "#e6f9f3" /* ou #fee2e2, #fef3c7 */,
  color: "#047857" /* ou #b91c1c, #92400e */,
}}>PUBLICADO</span>
```

Cores status:
- Publicado/Ativo/OK: bg #e6f9f3, fg #047857
- Rascunho/Pendente: bg #fef3c7, fg #92400e
- Arquivado/Inativo: bg #f3f4f6, fg #6b7280
- Erro/Rejeitado: bg #fee2e2, fg #b91c1c

## Filtros / toolbar
Barra branca 1px solid BORDER, radius 10, padding 12px 16px, display flex gap 10:
- Search input (esquerda, flex 1)
- Select dropdowns (filtros)
- Toggle de visualização (grid/lista) à direita
Filtros ativos como pills teal removíveis abaixo.

## Empty states
Card central com ícone SVG ~48px em fundo `#f3f4f6` rounded, título serif 20, descrição MUTED, CTA teal.

## Ícones
Usar componente `Icon` inline SVG (stroke 1.75) — consultar o dashboard.

## Não usar
- Tailwind classes (a menos que já exista globals)
- cores fora da paleta
- bordas mais grossas que 1px
- border-radius diferente de 6/8/10/12/14/99

---
Aplicar em ordem: noticias → anuncios → guia → agenda → midia → categorias → autores → comentarios → newsletter → configuracoes
