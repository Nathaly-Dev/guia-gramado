// Aplica o tema escolhido antes de pintar a página (evita piscar claro→escuro).
// Claro é o padrão; o escuro só vale se a pessoa escolheu.
try {
  if (localStorage.getItem("theme") === "dark") document.documentElement.dataset.theme = "dark";
} catch (_) {
  // Sem acesso ao armazenamento (aba anônima): fica no claro.
}
