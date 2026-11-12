# Segurança e dados

## Dados que o guia tem
| Dado | Classe | Onde fica | Quem vê |
|---|---|---|---|
| Roteiro, hotel, horários dos voos | pessoal | código e site | quem tiver o link |
| Remédios e aparelhos de saúde da mãe e da Nathaly | **sensível (saúde)** | código e site | quem tiver o link |
| Bairro de saída em São Paulo | pessoal | código e site | quem tiver o link |
| Marcações da mala e tema escolhido | pessoal | `localStorage` de cada celular | só aquele celular |

Decisão da Nathaly em 12/11/2026: manter os nomes dos remédios no site, com repositório privado e link não divulgado (D2).

## O que protege
- Repositório privado no GitHub.
- `noindex` (meta e cabeçalho `X-Robots-Tag`) e `robots.txt` com `Disallow: /`: buscadores não listam o site.
- Cabeçalhos de segurança na Vercel: CSP restrita (só o próprio site e `api.open-meteo.com`), `Referrer-Policy: no-referrer`, `nosniff`, sem câmera, microfone ou localização.
- Fontes e ícones hospedados no próprio site; nenhum rastreador ou analytics.
- Sem login, formulário ou dado enviado pelo guia.

## Riscos
- **Link vazado:** qualquer pessoa com o link vê dados de saúde e quando estamos fora de casa. Não postar o link; compartilhar só no WhatsApp entre nós duas.
- **Celular perdido:** as marcações da mala ficam no aparelho; não há dado sensível guardado além do próprio guia.

## Retenção
Depois da viagem (a partir de 29/11/2026): remover o projeto da Vercel e arquivar ou apagar o repositório.

## Se o link vazar
1. Na Vercel, apagar o deployment ou o projeto (o link para de funcionar).
2. Publicar de novo com outro nome de projeto, gerando um link novo.
3. Mandar o link novo só para a mãe.
