# Decisões

## D1. HTML, CSS e JavaScript puros, sem framework
**Contexto:** guia de 5 dias, conteúdo fixo, precisa abrir rápido no celular e funcionar sem sinal na serra.
**Decisão:** páginas estáticas com módulos JS nativos; lógica isolada em `core.js` e testada com `node:test`.
**Alternativas:** Next.js ou Vite + React (build, dependências e manutenção sem ganho para 5 telas).
**Consequências:** zero dependências instaladas; qualquer servidor estático serve. Renderização por template string, com todo texto passando por `esc()`.

## D2. Vercel com repositório privado
**Contexto:** as duas precisam abrir no celular a qualquer hora; o guia tem dado de saúde (remédios, aparelhos).
**Decisão:** código em repositório privado no GitHub; site na Vercel, com `noindex` e `robots.txt` bloqueando buscadores.
**Alternativas:** GitHub Pages (exige repositório público no plano gratuito), arquivo HTML no WhatsApp (no iPhone a linha do tempo não funciona).
**Consequências:** quem tiver o link vê o guia. O link não deve ser postado em lugar público. Ver [security.md](security.md).

## D3. Tema natalino sobre o design system
**Contexto:** o design system v0.1 é roxo; a Nathaly pediu visual "bem natalino".
**Decisão:** `tokens.css` e `components.css` copiados sem edição; `guia.css` sobrescreve só as cores (vinho, verde-pinheiro, dourado e creme) e acrescenta escala de tipo, espaço e movimento.
**Propostas para o DS:** tokens `--success`, `--sunken`, escala `--fs-*`/`--sp-*`, suporte a temas por projeto, `:focus-visible` e alvo de toque de 44 px nos botões.
**Consequências:** contraste AA conferido por `scripts/check-contrast.mjs` nos dois temas.

## D4. Previsão do tempo pelo Open-Meteo
**Contexto:** a Nathaly pediu previsão com alertas de frio e chuva.
**Decisão:** Open-Meteo (sem chave, sem cadastro). A previsão fica salva no celular e é renovada a cada hora com internet; sem conexão, mostra a última salva.
**Alternativas:** OpenWeather e Climatempo (exigem chave de API, que ficaria exposta num site estático).
**Consequências:** o IP de quem abre o guia chega ao Open-Meteo; nenhum outro dado é enviado. Previsão só existe até 16 dias à frente.

## D5. Modo offline com service worker
**Decisão:** guarda os arquivos do guia no celular e responde do cache, atualizando em segundo plano.
**Consequência:** a cada mudança no conteúdo, subir `VERSION` em `site/sw.js`; a atualização aparece na segunda abertura.

## D6. Tema "Natal Luz à noite" e fonte Fraunces (substitui a paleta da D3)
**Contexto:** a paleta vinho e creme da D3 ficou fraca para a Nathaly ("bem natalino" era o pedido).
**Decisão:** comparei 3 direções lado a lado (A: Vila de Natal, verde com pinheiros; B: Cartão de Natal, vermelho com xadrez; C: Natal Luz à noite). A Nathaly escolheu a C: topo azul-noite com luzes desfocadas e dourado em todas as telas, conteúdo em creme, paradas como lâmpadas acesas e frases de boas-vindas por dia.
**Nova dependência:** fonte Fraunces (SIL OFL), a mesma do roteiro original, baixada do pacote `@fontsource-variable/fraunces@5.1.1` e hospedada em `site/fonts/`. Só títulos; o texto segue Inter (DS).
**Consequências:** a estrutura da D3 continua (DS copiado sem edição; `guia.css` sobrescreve cores e escala). Contraste AA conferido por script nas cores do creme e da faixa noturna, nos dois temas.
