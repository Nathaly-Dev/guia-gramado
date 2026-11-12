# Guia Gramado

Guia de viagem ao vivo para a viagem de mãe e filha a Gramado e Canela no Natal Luz (24 a 28/11/2026): mostra o que fazer agora, a que horas sair, como chegar e quanto custa, mais previsão do tempo, passo a passo do primeiro voo e a lista da mala de cada uma.

🚧 Uso pessoal. Repositório privado; o site fica num link da Vercel que só nós temos.

## O que tem

| Aba | Para quê |
|---|---|
| Roteiro | Linha do tempo do dia com "Agora", "Próximo" e "Saiam às…", trajeto, valor, mapa e Uber. Antes da viagem, contagem regressiva com tarefas. |
| Tempo | Previsão de cada dia com alertas de frio, chuva, calor e vento e sugestão do que vestir. |
| Voo | Primeiro voo passo a passo (Azul, só bagagem de mão) e direitos se atrasar. |
| Mala | Checklist da Nathaly e da mãe, como arrumar 10 kg, o que não pode levar e o que conferir no check-out. |
| Dicas | Hotel, água grátis, Uber, 220 V, ponto de encontro e telefones de emergência. |

Funciona sem internet depois da primeira abertura (instalar com "Adicionar à tela inicial"). Tema claro por padrão, escuro no botão da lua.

## Como rodar

```bash
npm run dev      # abre em http://localhost:5180
npm run check    # testes da lógica + contraste das cores
npm run icons    # regenera os ícones (precisa de Python com Pillow)
```

Sem dependências instaladas: HTML, CSS e JavaScript puros, servidos da pasta `site/`.

## Como editar o roteiro

Tudo está em [site/js/roteiro.js](site/js/roteiro.js) (horários, lugares, trajetos, valores) e [site/js/preparo.js](site/js/preparo.js) (voo, mala, dicas). Depois de editar:

1. `npm run check` (o teste acusa horário fora de ordem, preço invertido etc.).
2. Suba a versão em `VERSION` no [site/sw.js](site/sw.js) (`guia-v2`, `guia-v3`…), senão os celulares continuam com a cópia antiga.
3. Publicar: `git push` (a Vercel publica sozinha) ou `npx vercel --prod`.

No celular, a atualização aparece na segunda vez que o guia é aberto com internet.

## Estrutura

```
site/            o que vai para a Vercel
  index.html     estrutura e ícones
  css/           tokens.css e components.css (cópia do design system v0.1), guia.css (tema natalino), app.css
  js/            core.js (lógica testada), roteiro.js e preparo.js (conteúdo), app.js (telas)
  sw.js          modo offline
tests/           testes da lógica e do conteúdo (node:test)
scripts/         contraste das cores e geração dos ícones
docs/            decisões e segurança
```

## Escopo

**Dentro:** roteiro de 24 a 28/11, previsão do tempo, voo, mala, dicas, uso offline no celular.
**Fora:** login, reservas, pagamento, notificações push, outras viagens.

## Decisões e segurança

- [docs/decisions.md](docs/decisions.md): por que HTML puro, Vercel, Open-Meteo e tema natalino.
- [docs/security.md](docs/security.md): quais dados o guia tem e quem vê.

## Como usei IA

O guia foi construído com o Claude Code a partir do meu roteiro original. Eu defini o roteiro, os horários, os valores e as escolhas (hospedagem, privacidade, visual); a IA reestruturou o código, escreveu testes e pesquisou regras de voo, que conferi nas fontes indicadas no próprio guia.

## Licenças

Fontes Inter e Space Grotesk (SIL OFL, licenças em `site/fonts/`). Previsão do tempo: [Open-Meteo](https://open-meteo.com/) (CC BY 4.0).
