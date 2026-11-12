// Confere o contraste (WCAG AA) dos pares de cor usados no guia, nos dois temas.
// Lê os valores direto dos arquivos de tokens: se alguém mudar uma cor, o teste pega.
import { readFileSync } from "node:fs";

const css = ["site/css/tokens.css", "site/css/guia.css"]
  .map((f) => readFileSync(f, "utf8"))
  .join("\n")
  .replace(/\/\*[\s\S]*?\*\//g, "");

// Junta as variáveis de cor de todo bloco cujo seletor é exatamente `selector`.
function vars(selector) {
  const out = {};
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (m[1].trim() !== selector) continue;
    for (const [, k, v] of m[2].matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)) out[k] = v;
  }
  return out;
}

const light = vars(":root");
const dark = { ...light, ...vars(':root[data-theme="dark"]') };

const channel = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => channel(parseInt(hex.slice(i, i + 2), 16) / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// [frente, fundo, mínimo]: 4.5 para texto; 3 para ícone e marca de seleção.
const PAIRS = [
  ["text", "bg", 4.5], ["text", "surface", 4.5], ["text", "sunken", 4.5], ["text", "accent-soft", 4.5],
  ["text", "notice-soft", 4.5], ["text", "danger-soft", 4.5], ["text", "success-soft", 4.5],
  ["muted", "bg", 4.5], ["muted", "surface", 4.5], ["muted", "sunken", 4.5], ["muted", "accent-soft", 4.5],
  ["accent", "bg", 4.5], ["accent", "surface", 4.5], ["accent", "accent-soft", 4.5], ["on-accent", "accent", 4.5],
  ["success", "success-soft", 4.5], ["success", "surface", 4.5], ["success", "sunken", 3],
  ["notice", "notice-soft", 4.5], ["danger", "danger-soft", 4.5], ["danger", "surface", 4.5],
  ["surface", "success", 3],
  ["on-accent-muted", "accent", 4.5], ["ornament-on-accent", "accent", 3], ["ornament", "bg", 3], ["ornament", "surface", 3],
  ["accent", "sunken", 4.5], ["ornament", "accent-soft", 3],
];

let fail = 0;
for (const [name, theme] of [["claro", light], ["escuro", dark]]) {
  for (const [fg, bg, min] of PAIRS) {
    if (!theme[fg] || !theme[bg]) {
      console.error(`✗ ${name}: token ausente (--${theme[fg] ? bg : fg})`);
      fail++;
      continue;
    }
    const r = ratio(theme[fg], theme[bg]);
    if (r < min) fail++;
    console.log(`${r >= min ? "✓" : "✗"} ${name.padEnd(6)} --${fg} sobre --${bg}: ${r.toFixed(2)} (mín. ${min})`);
  }
}

if (fail) {
  console.error(`\n${fail} par(es) abaixo do mínimo.`);
  process.exit(1);
}
console.log("\nContraste AA ok nos dois temas.");
