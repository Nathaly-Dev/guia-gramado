// Roteiro da viagem: fonte única de horários, lugares, trajetos e valores.
// Horário de Brasília (Gramado e São Paulo têm o mesmo fuso).
//
// Parada (stop):
//   t      "HH:MM" em que a atividade começa
//   leg    como chegar até ela, saindo da parada anterior
//          { mode: walk|uber|car|bus|flight, min: [de, até], dist, price: [de, até], label, alt, leaveAt }
//   trip   a própria parada é um deslocamento que começa em t (mesmo formato de leg)
//   place  texto de busca no mapa; addr: endereço exibido; uberTo: destino do Uber
//   cost   texto do valor; paid: já pago (voucher)
//
// Dia: welcome = título de boas-vindas [antes, destaque, depois]; magic = frase do dia.

export const HOTEL = "Rua Pedro Candiago, 993, Gramado, RS";
const GATZZ = "Av. das Hortênsias, 3380, Gramado, RS";

// Tarefas antes da viagem (aparecem na contagem regressiva).
export const BEFORE = [
  { date: "2026-11-21", t: "12:55", text: "Check-in da ida liberado no app da Azul (abre 72 h antes do voo)." },
  { date: "2026-11-23", t: "09:00", text: "Fazer o check-in da ida e salvar os cartões de embarque no celular." },
  { date: "2026-11-23", t: "20:00", text: "Malas fechadas e pesadas (até 10 kg), celulares e power bank carregados, documentos na mochila." },
];

export const DAYS = [
  {
    date: "2026-11-24", tab: "Ter 24", name: "Viagem e primeiras luzes",
    hint: "De São Paulo a Gramado, comer algo e ver o show.",
    welcome: ["Bem-vindas a ", "Gramado", "!"],
    magic: "A magia começa hoje: as primeiras luzes de Natal se acendem para vocês.",
    endAt: "23:59",
    stops: [
      { t: "09:30", title: "Saída para Congonhas", desc: "Da casa do seu pai, na Vila Nova Cachoeirinha, de carro com a parente. A Marginal pode ter trânsito, então não atrasem.", place: "Aeroporto de Congonhas", trip: { mode: "car", min: [60, 60], dist: "25 km", label: "Carro" }, cost: "R$ 120" },
      { t: "10:45", title: "Chegada em Congonhas", desc: "Sem mala para despachar: sigam direto para o raio-x, com calma. Passo a passo na aba Voo.", place: "Aeroporto de Congonhas" },
      { t: "12:55", title: "Voo Azul para Porto Alegre", desc: "Chegada prevista às 14h40. Estejam no portão até 12h15.", leg: { mode: "walk", label: "Até o portão (confiram no painel)" }, paid: true },
      { t: "14:40", title: "Pouso em Porto Alegre", desc: "O carro do transfer espera no aeroporto. São cerca de 2 horas (115 km) até Gramado; quem enjoa vai no banco da frente.", place: "Aeroporto Salgado Filho Porto Alegre", leg: { mode: "flight", label: "Voo · 1h45" }, cost: "Transfer incluso" },
      { t: "17:00", title: "Chegada ao hotel e descanso", desc: "Check-in no Colina São Francisco.", addr: HOTEL, place: HOTEL, leg: { mode: "car", min: [120, 120], dist: "115 km", label: "Transfer" } },
      { t: "18:30", title: "Rissul (centro)", desc: "Água e lanche para a noite. Ver se a Andesu Culinária Coreana entrega pelo iFood.", place: "Rissul supermercado centro Gramado", leg: { mode: "walk", min: [15, 15], dist: "1,2 km" }, cost: "Outro dinheiro" },
      { t: "20:00", title: "Show de Acendimento", desc: "No Palácio dos Festivais.", place: "Palácio dos Festivais Gramado", leg: { mode: "walk", min: [5, 5], dist: "400 m" }, photo: "Palácio dos Festivais iluminado e as luzes do centro", cost: "Grátis" },
      { t: "21:00", title: "Volta ao hotel", desc: "Descansar para amanhã.", addr: HOTEL, place: HOTEL, trip: { mode: "walk", min: [15, 15], dist: "1,2 km", alt: "ou Uber 5 min · R$ 10 a 15" }, uberTo: HOTEL },
    ],
  },
  {
    date: "2026-11-25", tab: "Qua 25", name: "Gramado a pé",
    hint: "Tudo em Gramado. Manhã no centro, tarde no Lago Negro, noite de luzes.",
    welcome: ["Que comece o ", "encanto", ""],
    magic: "Casinhas de Natal, chocolate quente e uma surpresa em cada esquina.",
    notes: ["A partir das 15h10, o check-in do voo de volta abre no app da Azul."],
    endAt: "22:00",
    stops: [
      { t: "07:00", title: "Café no hotel", desc: "Das 7h às 9h.", cost: "Incluso" },
      { t: "09:30", title: "Praça das Etnias", desc: "Pão com linguiça, Vila de Natal e Casa do Papai Noel. Fica ao lado da rodoviária.", place: "Praça das Etnias Gramado", leg: { mode: "walk", min: [15, 20], dist: "1,2 a 1,5 km" }, tip: "Bebedouro grátis aqui", cost: "Outro dinheiro" },
      { t: "10:30", title: "Lago Joaquina Rita Bier", desc: "Volta a pé no calçadão do lago.", place: "Lago Joaquina Rita Bier Gramado", leg: { mode: "walk", min: [5, 5], dist: "menos de 500 m" }, cost: "Grátis" },
      { t: "11:30", title: "Centro: Rua Coberta e arredores", desc: "Rua Coberta, Igreja São Pedro, relógio inglês, cabine telefônica vermelha, pracinha da prefeitura, Fonte do Amor Eterno e Jardim das Borboletas da Florybal. Tudo a 2 a 5 min um do outro.", place: "Rua Coberta Gramado", leg: { mode: "walk", min: [15, 15], dist: "1,2 km" }, photo: "Igreja São Pedro, relógio inglês, cabine vermelha, Fonte do Amor", tip: "Bebedouro em frente à Igreja São Pedro", cost: "Grátis" },
      { t: "12:30", title: "Naro Sushi", desc: "Buffet de almoço. Confiram o endereço no voucher.", place: "Naro Culinária Japonesa Gramado", leg: { mode: "walk", label: "No centro" }, paid: true },
      { t: "14:00", title: "Piquenique no Lago Negro", desc: "Compras rápidas no Rissul do centro (frutas, cuca, chocolate, suco) e piquenique leve no lago. Depois, o Mistério do Lago da Florybal, ao lado do lago.", place: "Lago Negro Gramado", addr: "Mistério do Lago: Rua João Augusto Lied, 636", leg: { mode: "walk", min: [20, 20], dist: "1,5 km", alt: "ou Uber 5 min · R$ 10 a 15" }, uberTo: "Lago Negro, Gramado, RS", photo: "Lago Negro e os cenários de fadas do Mistério do Lago", cost: "Grátis" },
      { t: "16:00", title: "Trocar o voucher do Bustour", desc: "Na Loja Brocker. Sem isso não dá para embarcar amanhã!", addr: "Av. das Hortênsias, 1845, centro", place: "Av. das Hortênsias 1845 Gramado", leg: { mode: "uber", min: [5, 5], dist: "2 km", price: [10, 15], alt: "ou a pé 25 min" }, tip: "Obrigatório" },
      { t: "16:15", title: "Chocolate quente na MuKli", desc: "Na porta ao lado da Brocker. Abre das 8h30 às 20h.", addr: "Av. das Hortênsias, 1885", place: "MuKli Av. das Hortênsias 1885 Gramado", leg: { mode: "walk", min: [1, 1], dist: "porta ao lado" }, cost: "Cerca de R$ 15 cada" },
      { t: "16:30", title: "Rua Torta, Major Nicoletti e Mogusha", desc: "Rua Torta, Praça e Museu Major Nicoletti (grátis), vitrines e 1 pote de fondue de chocolate da Mogusha para dividir.", place: "Rua Torta Gramado", leg: { mode: "walk", min: [10, 10], dist: "800 m" }, photo: "Rua Torta e a Praça Major Nicoletti, linda de dia e de noite", cost: "Cerca de R$ 25" },
      { t: "18:30", title: "Jantar de lámen na Niji Store", desc: "Conveniência asiática no centro.", place: "Niji Store Gramado", leg: { mode: "walk", min: [5, 10], dist: "400 a 800 m" }, cost: "Outro dinheiro" },
      { t: "20:00", title: "Show de Acendimento", desc: "No Palácio dos Festivais.", place: "Palácio dos Festivais Gramado", leg: { mode: "walk", min: [5, 10], dist: "no centro" }, photo: "Fachadas iluminadas do centro", cost: "Grátis" },
      { t: "21:00", title: "Volta ao hotel", desc: "Descansar: amanhã o café é mais cedo.", addr: HOTEL, place: HOTEL, trip: { mode: "walk", min: [15, 15], dist: "1,2 km", alt: "ou Uber 5 min · R$ 10 a 15" }, uberTo: HOTEL },
    ],
  },
  {
    date: "2026-11-26", tab: "Qui 26", name: "Canela, trenó e Sonho de Natal",
    hint: "Dia longo. Se sua mãe ficar cansada ou tonta, pulem o show da noite.",
    welcome: ["Um dia ", "inesquecível", ""],
    magic: "A cascata vista lá do alto, uma descida de trenó e o Papai Noel descendo da Catedral.",
    notes: ["Façam o check-in do voo de volta no app da Azul, se ainda não fizeram."],
    endAt: "22:00",
    stops: [
      { t: "07:00", title: "Café no hotel", desc: "Das 7h às 8h30. Não demorem!", cost: "Incluso" },
      { t: "09:00", title: "Ir à parada do Bustour", desc: "No Lago Negro. Levem o ingresso trocado ontem.", place: "Lago Negro Gramado", leg: { mode: "walk", min: [10, 10], dist: "800 m" } },
      { t: "09:19", title: "Bustour, rota vermelha", desc: "Até a Catedral de Pedra, em Canela. Chegada por volta das 10h.", place: "Catedral de Pedra Canela", trip: { mode: "bus", label: "Embarque às 9h19" }, paid: true },
      { t: "10:10", title: "Bondinhos Aéreos", desc: "Rota amarela do Bustour até os Bondinhos. Passeio das 10h30 às 12h30, sem o Aerozuum.", place: "Bondinhos Aéreos Canela", leg: { mode: "bus", label: "Rota amarela às 10h10" }, photo: "Cascata do Caracol vista do bondinho", paid: true },
      { t: "12:30", title: "Volta à Catedral", desc: "Rota amarela de volta. O horário está na placa da parada.", place: "Catedral de Pedra Canela", trip: { mode: "bus", label: "Rota amarela" }, paid: true },
      { t: "13:00", title: "Almoço rápido e Catedral de Pedra", desc: "Almoço em Canela e fotos na Catedral.", place: "Catedral de Pedra Canela", leg: { mode: "walk", min: [2, 5], dist: "até 400 m" }, photo: "Catedral de Pedra", cost: "Outro dinheiro" },
      { t: "14:00", title: "Alpen Park: trenó de montanha", desc: "Trenó avulso comprado na bilheteria. Ela controla a velocidade no freio. Com a labirintite, a primeira descida devagar. Fujam da montanha-russa e da torre de queda livre.", addr: "Rodovia Arnaldo Oppitz, 901, Canela", place: "Alpen Park Canela", leg: { mode: "uber", min: [10, 10], dist: "3 km", price: [15, 20] }, photo: "A descida de trenó", cost: "Sua mãe paga à parte" },
      { t: "15:30", title: "A caminho do Museu de Cera", desc: "Uber até o Dreamland.", place: "Dreamland Museu de Cera Gramado", trip: { mode: "uber", min: [15, 15], dist: "6 km", price: [20, 30] }, uberTo: "Dreamland Museu de Cera, Gramado, RS" },
      { t: "15:45", title: "Dreamland Museu de Cera", desc: "Visita até umas 17h15 (fecha às 18h30).", place: "Dreamland Museu de Cera Gramado", photo: "Personagens do Museu de Cera", paid: true },
      { t: "17:40", title: "Lanche na Big Tentação", desc: "No centro de Canela, para esperar o show.", addr: "Rua Augusto Pestana, Canela", place: "Big Tentação Cafeteria Rua Augusto Pestana Canela", leg: { mode: "uber", min: [15, 15], dist: "6 km", price: [25, 35] }, uberTo: "Rua Augusto Pestana, Canela, RS", cost: "Outro dinheiro" },
      { t: "20:30", title: "Sonho de Natal na Catedral", desc: "Show de luzes e Papai Noel descendo de rapel pelas torres.", place: "Catedral de Pedra Canela", leg: { mode: "walk", min: [5, 5], dist: "400 m" }, photo: "A Catedral iluminada", cost: "Grátis" },
      { t: "21:30", title: "Uber de volta ao hotel", desc: "Depois do show. À noite o preço costuma subir.", addr: HOTEL, place: HOTEL, trip: { mode: "uber", min: [20, 20], dist: "8 km", price: [35, 50] }, uberTo: HOTEL },
    ],
  },
  {
    date: "2026-11-27", tab: "Sex 27", name: "Natal no centro e noite de Gatzz",
    hint: "Manhã leve, Parada de Natal à tarde e fondue com show à noite.",
    welcome: ["Gramado em ", "clima de festa", ""],
    magic: "Um dia para guardar no coração, com cheirinho de chocolate no ar.",
    notes: ["Arrumem a mala hoje à noite: o check-out é amanhã às 10h."],
    endAt: "23:00",
    stops: [
      { t: "07:00", title: "Café no hotel", desc: "Das 7h às 9h.", cost: "Incluso" },
      { t: "10:00", title: "Vila de Natal e Igreja do Relógio", desc: "Passeio pelas casinhas de Natal.", place: "Igreja do Relógio Gramado", leg: { mode: "walk", min: [15, 20], dist: "1,2 a 1,5 km" }, photo: "Casinhas da Vila de Natal e a Igreja do Relógio", cost: "Grátis" },
      { t: "11:00", title: "Palco da Rua Coberta e Praça do Moinho", desc: "Apresentações no palco e a pracinha do moinho, ao lado do mercado Nacional.", place: "Rua Coberta Gramado", leg: { mode: "walk", min: [5, 10], dist: "400 a 800 m" }, photo: "Praça do Moinho", cost: "Grátis" },
      { t: "12:30", title: "Almoço no Dubai Espetaria", desc: "Alaminuta a partir de R$ 23,90.", place: "Dubai Espetaria e Hamburgueria Gramado", leg: { mode: "walk", min: [5, 5], dist: "400 m" }, tip: "4 min da Igreja São Pedro", cost: "Outro dinheiro" },
      { t: "14:00", title: "Descanso no hotel", desc: "Recarregar as energias.", addr: HOTEL, place: HOTEL, leg: { mode: "walk", min: [15, 15], dist: "1,2 km", alt: "ou Uber 5 min · R$ 10 a 15" }, uberTo: HOTEL },
      { t: "15:00", title: "Parada de Natal", desc: "Na Av. Borges de Medeiros. Cheguem uns 20 min antes para pegar lugar.", place: "Av. Borges de Medeiros Gramado", leg: { mode: "walk", min: [15, 15], dist: "1,2 km", leaveAt: "14:25" }, photo: "Os carros da Parada", cost: "Grátis" },
      { t: "15:45", title: "Volta ao hotel", desc: "Descanso e banho para a noite.", addr: HOTEL, place: HOTEL, trip: { mode: "walk", min: [15, 15], dist: "1,2 km", alt: "ou Uber 5 min · trânsito lento por causa da Parada" }, uberTo: HOTEL },
      { t: "17:15", title: "Uber até o Gatzz", desc: "Saiam no horário: o show começa às 18h.", addr: "Av. das Hortênsias, 3380", place: "Gatzz Gramado Av. das Hortênsias 3380", trip: { mode: "uber", min: [10, 15], dist: "3 km", price: [15, 25] }, uberTo: GATZZ },
      { t: "18:00", title: "Gatzz: fondue e show Bellepoque", desc: "Queijo, carne e chocolate. Primeira sessão (não a das 21h30).", place: "Gatzz Gramado", photo: "O salão do Gatzz", paid: true },
      { t: "21:00", title: "Uber de volta ao hotel", desc: "À noite o preço costuma subir.", addr: HOTEL, place: HOTEL, trip: { mode: "uber", min: [10, 15], dist: "3 km", price: [15, 30] }, uberTo: HOTEL },
    ],
  },
  {
    date: "2026-11-28", tab: "Sáb 28", name: "Despedida",
    hint: "Última caminhada e volta para casa.",
    welcome: ["Até logo, ", "Gramado", ""],
    magic: "Guardem cada luz na memória: Gramado já está com saudade de vocês.",
    endAt: "17:00",
    stops: [
      { t: "07:00", title: "Café no hotel", desc: "Das 7h às 8h30.", cost: "Incluso" },
      { t: "08:45", title: "Última caminhada no Lago Negro", desc: "O lago de manhã, sem movimento.", place: "Lago Negro Gramado", leg: { mode: "walk", min: [10, 10], dist: "800 m" }, photo: "Lago Negro vazio de manhã", cost: "Grátis" },
      { t: "10:00", title: "Check-out", desc: "Confiram o quarto com a lista \"Antes de sair do hotel\", na aba Mala.", addr: HOTEL, place: HOTEL, leg: { mode: "walk", min: [10, 10], dist: "800 m" } },
      { t: "10:30", title: "Saída para o aeroporto", desc: "Transfer até o Aeroporto Salgado Filho, em Porto Alegre.", place: "Aeroporto Salgado Filho Porto Alegre", trip: { mode: "car", min: [120, 120], dist: "115 km", label: "Transfer" }, photo: "Os Pórticos na estrada, se passar por eles", cost: "Incluso" },
      { t: "12:30", title: "Chegada ao aeroporto", desc: "Direto para o raio-x; depois, almoço com calma perto do portão.", place: "Aeroporto Salgado Filho Porto Alegre", cost: "Outro dinheiro" },
      { t: "15:10", title: "Voo Azul para Congonhas", desc: "Estejam no portão até 14h30. Horário de chegada no cartão de embarque.", leg: { mode: "walk", label: "Até o portão (confiram no painel)" }, paid: true },
    ],
  },
];
