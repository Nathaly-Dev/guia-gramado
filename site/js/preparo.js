// Conteúdo das abas Voo, Mala e Dicas.
// Regras de voo conferidas em 12/11/2026 (Azul e ANAC); confirmem no app da Azul antes de sair.

export const PEOPLE = [
  { id: "nathaly", name: "Nathaly" },
  { id: "mae", name: "Mãe" },
];

// Checklist da mala. who: "both" (as duas), "nathaly" ou "mae".
export const PACKING = [
  {
    id: "docs", title: "Documentos e dinheiro", icon: "id",
    items: [
      { id: "rg", who: "both", text: "RG ou CNH original", note: "CNH digital só vale aberta no app oficial; print não vale." },
      { id: "passaporte", who: "both", text: "Passaporte, como documento reserva", note: "Vale no voo nacional. Guardem longe do RG: se um sumir, o outro resolve." },
      { id: "embarque", who: "both", text: "Cartão de embarque no app da Azul + print" },
      { id: "vouchers", who: "both", text: "Prints dos vouchers num álbum \"Gramado\"", note: "Naro, Bondinhos, Bustour, Museu de Cera, Gatzz, Mogusha." },
      { id: "cartoes", who: "both", text: "Cartão de débito/crédito e um pouco de dinheiro trocado" },
      { id: "saude-cart", who: "both", text: "Carteirinha do plano de saúde ou cartão do SUS" },
      { id: "contatos", who: "both", text: "Telefone do hotel e do transfer salvos no celular" },
      { id: "fotos-docs", who: "both", text: "Foto dos documentos no celular", note: "Não serve para embarcar, mas ajuda num boletim de ocorrência." },
    ],
  },
  {
    id: "saude", title: "Remédios e saúde (vão na mochila)", icon: "pill",
    items: [
      { id: "anticoncepcional", who: "nathaly", text: "Anticoncepcional", note: "Cartela atual + a próxima, se virar na viagem. Alarme no mesmo horário de sempre." },
      { id: "loratadina", who: "nathaly", text: "Loratadina" },
      { id: "budesonida", who: "nathaly", text: "Budesonida + receita" },
      { id: "vit-n", who: "nathaly", text: "Vitaminas", note: "Porta-comprimidos semanal ocupa menos que os frascos." },
      { id: "glifage", who: "mae", text: "Glifage para todos os dias + 3 dias extras", note: "Na embalagem original, com a receita." },
      { id: "vit-m", who: "mae", text: "Vitaminas", note: "Porta-comprimidos semanal ocupa menos que os frascos." },
      { id: "glicosimetro", who: "mae", text: "Aparelho de glicose + fitas + lancetas" },
      { id: "pressao", who: "mae", text: "Aparelho de pressão" },
      { id: "pilhas", who: "mae", text: "Pilhas ou baterias reserva dos dois aparelhos" },
      { id: "receitas", who: "mae", text: "Receitas (foto no celular e papel)", note: "Mostrem no raio-x se perguntarem pelas lancetas." },
      { id: "tontura", who: "mae", text: "Remédio para tontura, se o médico já indicou" },
      { id: "lanche", who: "mae", text: "Lanchinhos para não ficar sem comer", note: "Glifage vai com as refeições; voo e dia 26 são longos." },
      { id: "kit", who: "both", text: "Remédio de dor que já usa e curativo para bolha" },
      { id: "protetor", who: "both", text: "Protetor solar e hidratante labial", note: "O vento da serra resseca a boca." },
      { id: "alcool", who: "both", text: "Álcool em gel pequeno" },
    ],
  },
  {
    id: "roupas", title: "Roupas para 5 dias", icon: "shirt",
    items: [
      { id: "corpo", who: "both", text: "No corpo, no dia do voo: calça jeans, blusa, malha, casaco mais quente e tênis", note: "O mais pesado vai vestido: sobra espaço e peso na mala." },
      { id: "calcas", who: "both", text: "2 calças na mala: 1 preta (serve no Gatzz) e 1 confortável" },
      { id: "blusas", who: "both", text: "4 blusas básicas em cores que combinam entre si" },
      { id: "malha", who: "both", text: "1 cardigã ou suéter leve" },
      { id: "termica", who: "both", text: "1 segunda pele (blusa térmica fina)", note: "Esquenta muito e ocupa quase nada." },
      { id: "cortavento", who: "both", text: "1 corta-vento ou capa de chuva fininha" },
      { id: "gatzz", who: "both", text: "1 blusa mais arrumada para o Gatzz", note: "Com a calça preta e um acessório, vira roupa de jantar." },
      { id: "pijama", who: "both", text: "1 pijama quente" },
      { id: "intimas", who: "both", text: "6 calcinhas, 3 sutiãs e 6 pares de meia (1 grossa)" },
      { id: "cachecol", who: "both", text: "Cachecol" },
    ],
  },
  {
    id: "calcados", title: "Calçados", icon: "shoe",
    items: [
      { id: "tenis", who: "both", text: "Tênis confortável já usado (vai no pé)", note: "Sapato novo faz bolha em dia de muita caminhada." },
      { id: "fechado", who: "both", text: "1 calçado fechado que aguente chuva" },
      { id: "solado", who: "mae", text: "Solado que não escorregue", note: "Calçada molhada e ladeira são o maior risco de queda." },
      { id: "chinelo", who: "both", text: "Chinelo para o hotel" },
    ],
  },
  {
    id: "higiene", title: "Higiene", icon: "drop",
    items: [
      { id: "escova", who: "both", text: "Escova, pasta e fio dental" },
      { id: "desodorante", who: "both", text: "Desodorante roll-on ou em creme" },
      { id: "frascos", who: "both", text: "Xampu e cremes em frascos pequenos" },
      { id: "pente", who: "both", text: "Pente ou escova de cabelo, elásticos" },
      { id: "maquiagem", who: "both", text: "Maquiagem e skincare" },
    ],
  },
  {
    id: "eletronicos", title: "Eletrônicos", icon: "plug",
    items: [
      { id: "celular", who: "both", text: "Celular, carregador e cabo" },
      { id: "powerbank", who: "both", text: "Power bank de até 27.000 mAh" },
      { id: "fone", who: "both", text: "Fone de ouvido" },
      { id: "bivolt", who: "both", text: "Secador e chapinha só se forem 220 V ou bivolt", note: "Gramado é 220 V: aparelho 127 V queima." },
      { id: "benjamim", who: "nathaly", text: "Um benjamim ou régua pequena", note: "Quarto de hotel costuma ter poucas tomadas." },
    ],
  },
  {
    id: "mochila", title: "Mochila de costas (vai com vocês na cabine)", icon: "backpack",
    items: [
      { id: "garrafa", who: "both", text: "Garrafinha vazia", note: "Encham depois do raio-x e nos bebedouros grátis de Gramado." },
      { id: "guarda-chuva", who: "both", text: "Guarda-chuva pequeno" },
      { id: "chiclete", who: "both", text: "Chiclete ou bala para os ouvidos" },
      { id: "oculos", who: "both", text: "Óculos de sol (e de grau, se usar)" },
      { id: "sacola", who: "both", text: "Sacola dobrável para as compras" },
      { id: "saco-roupa", who: "both", text: "Saquinho para roupa suja" },
    ],
  },
];

// Antes de sair do hotel no dia 28.
export const CHECKOUT = [
  "Carregadores e cabos nas tomadas",
  "Cofre do quarto",
  "Banheiro e box",
  "Gavetas, armário e atrás da porta",
  "Remédios, aparelhos e documentos na mochila",
];

// Dicas específicas de cada uma (aparecem na aba Mala, ao escolher a pessoa).
export const PERSON_TIPS = {
  nathaly: [
    "Anticoncepcional no mesmo horário de sempre: Gramado tem o mesmo fuso de São Paulo. Deixe um alarme no celular.",
    "Você é a navegadora: este guia, o mapa e o Uber ficam no seu celular. Carregue o power bank toda noite.",
  ],
  mae: [
    "Glifage com as refeições: no dia do voo e no dia 26 (Canela), não pule o café nem o almoço.",
    "Meça a glicose e a pressão nos horários de costume, mesmo em dia de passeio.",
    "Com 60 anos ou mais, ela tem fila preferencial no aeroporto e embarca primeiro. Vocês podem ir juntas.",
    "Labirintite: no avião, assento perto das asas balança menos; no transfer pela serra, banco da frente e olhar para a estrada.",
    "Cansou ou ficou tonta? Pausa, água e sentar. O roteiro tem plano B no dia 26.",
  ],
};

// Como montar a mala de 10 kg (aba Mala, parte comum).
export const PACK_TIPS = [
  "Roupas em 2 cores neutras + 1 de destaque: tudo combina com tudo. 3 calças e 5 blusas dão 15 combinações.",
  "Enrolem as roupas em vez de dobrar e usem organizadores (ou saquinhos) por tipo.",
  "Meias e calcinhas dentro dos sapatos; sapatos em saco plástico nas laterais da mala.",
  "Pesem em casa: subam na balança com e sem a mala e façam a conta. Limite de 10 kg por mala de mão.",
  "Deixem uns 2 kg livres na ida: chocolate e lembrancinhas pesam na volta.",
  "Mala de mão da Azul: até 55 × 35 × 25 cm com rodinhas. Mochila: até 45 × 35 × 20 cm, embaixo do assento.",
];

// O que não pode (Azul, voo nacional).
export const FORBIDDEN = [
  { title: "Líquidos acima do limite", text: "Na cabine, cada frasco até 300 ml e no total até 1,2 L. Vale para perfume, xampu, vinho, geleia e doce de leite." },
  { title: "Objetos cortantes", text: "Faca, canivete, estilete e tesoura de ponta." },
  { title: "Inflamáveis", text: "Álcool líquido, fluido de isqueiro, tinta spray e fogos." },
  { title: "Armas, réplicas e spray de pimenta", text: "Proibidos na cabine e na mala." },
  { title: "Power bank", text: "Nunca no porão, no máximo 2 por pessoa e proibido usar durante o voo (regra da ANAC desde abril de 2026)." },
  { title: "Mala despachada no portão", text: "Se o bagageiro lotar, a Azul pode mandar a mala de mão para o porão. Antes de entregar, tirem power bank, remédios, aparelhos, documentos e eletrônicos." },
];

// Compras na volta.
export const SHOPPING = [
  "Chocolate em barra e bombom vão na mala de mão sem problema: contam só no peso.",
  "Vinho, licor, geleia, doce de leite e fondue contam como líquido: até 300 ml cada e 1,2 L no total, somando com xampu e perfume.",
  "Comprem por último, no dia 27, para não carregar peso durante os passeios.",
];

// Aba Voo: passo a passo do primeiro voo.
export const FLIGHTS = [
  { dir: "Ida", date: "Ter 24/11", from: "Congonhas (São Paulo)", to: "Salgado Filho (Porto Alegre)", dep: "12:55", arr: "14:40" },
  { dir: "Volta", date: "Sáb 28/11", from: "Salgado Filho (Porto Alegre)", to: "Congonhas (São Paulo)", dep: "15:10", arr: null },
];

export const FLIGHT_STEPS = [
  {
    title: "Antes de sair de casa",
    items: [
      "Check-in no app da Azul: abre 72 h antes do voo (ida: sáb 21/11, 12h55; volta: qua 25/11, 15h10).",
      "Salvem os cartões de embarque no celular e tirem print.",
      "Se o app oferecer assento grátis, escolham lado a lado, perto das asas.",
      "Documento com foto na mão e celular carregado.",
    ],
  },
  {
    title: "Chegando em Congonhas (10h45)",
    items: [
      "Procurem o painel \"Partidas\" e achem o número do voo.",
      "Sem mala para despachar: sigam direto para \"Embarque\" (o raio-x).",
      "Sua mãe tem fila preferencial por ter mais de 60 anos. Peçam para passar juntas.",
    ],
  },
  {
    title: "No raio-x",
    items: [
      "Mala e mochila vão na esteira. Casaco grosso, celular, chaves, moedas e cinto vão numa bandeja.",
      "Notebook ou tablet saem da mochila e vão numa bandeja separada.",
      "Aparelhos de glicose e pressão podem passar. Se perguntarem das lancetas, mostrem a receita.",
      "Garrafinha vazia; encham no bebedouro depois.",
    ],
  },
  {
    title: "No portão",
    items: [
      "Confiram o portão no painel e no app: ele pode mudar.",
      "Estejam lá 40 min antes do voo. O embarque costuma começar nesse horário.",
      "O grupo prioritário (60+) embarca primeiro, e a acompanhante pode ir junto.",
      "No embarque, mostrem o cartão de embarque e o documento com foto.",
    ],
  },
  {
    title: "Dentro do avião",
    items: [
      "Mala de mão no compartimento de cima, com as rodinhas para dentro. Mochila embaixo do assento da frente.",
      "Cinto afivelado sempre que estiverem sentadas. Celular em modo avião.",
      "Balançou? É turbulência, normal como carro em estrada de terra.",
      "Banheiro liberado quando o aviso do cinto apagar.",
      "Na subida e na descida, mastiguem chiclete, engulam ou bocejem para destampar os ouvidos.",
    ],
  },
  {
    title: "Chegando em Porto Alegre",
    items: [
      "Esperem o avião parar e o aviso do cinto apagar para levantar.",
      "Sigam as placas de \"Saída\". Sem mala despachada, não precisa ir à esteira.",
      "O motorista do transfer espera no desembarque. Tenham o telefone dele salvo.",
    ],
  },
  {
    title: "Volta (sáb 28/11)",
    items: [
      "Transfer sai do hotel às 10h30 e chega ao aeroporto por volta das 12h30.",
      "Combinem antes quem busca vocês em Congonhas.",
    ],
  },
];

export const PASSENGER_RIGHTS = [
  { after: "1 h de atraso", right: "Comunicação: internet e telefone." },
  { after: "2 h", right: "Alimentação: lanche ou voucher." },
  { after: "4 h", right: "Hotel e transporte, se precisar dormir, ou outro voo e reembolso." },
];

// Aba Dicas: em Gramado.
export const TIPS = [
  { title: "Hotel", icon: "bed", text: "Colina São Francisco, Rua Pedro Candiago, 993. Café das 7h às 10h." },
  { title: "Água grátis", icon: "drop", text: "Bebedouros de água gelada e quente em frente à Igreja São Pedro e na Praça das Etnias." },
  { title: "Uber", icon: "car", text: "Tempos, km e preços do roteiro são estimativas. À noite e depois dos shows sobe: se disparar, esperem 10 min ou andem uma quadra para longe da multidão." },
  { title: "Vouchers", icon: "ticket", text: "Prints de tudo no celular: Naro, Bondinhos, Bustour, Museu de Cera, Gatzz e Mogusha." },
  { title: "Tomadas de 220 V", icon: "plug", text: "Gramado e Canela são 220 V. Confiram na etiqueta se o aparelho é bivolt." },
  { title: "Ponto de encontro", icon: "pin", text: "Se se perderem, encontrem-se em frente à Igreja São Pedro. Compartilhem a localização em tempo real no WhatsApp." },
  { title: "Na multidão", icon: "shield", text: "Celular no bolso da frente e bolsa cruzada na frente do corpo nos shows e na Parada." },
  { title: "Ritmo", icon: "heart", text: "Ladeiras e calçadas irregulares cansam. Pausa para sentar a cada passeio longo; ninguém precisa fazer tudo." },
];

export const EMERGENCY = [
  { label: "SAMU", tel: "192" },
  { label: "Bombeiros", tel: "193" },
  { label: "Polícia Militar", tel: "190" },
];

export const HOSPITAL = { name: "Hospital Arcanjo São Miguel", place: "Hospital Arcanjo São Miguel Gramado" };
