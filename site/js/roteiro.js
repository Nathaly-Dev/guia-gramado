// Roteiro da viagem: fonte única de horários, lugares, trajetos e valores.
// Horário de Brasília (Gramado e São Paulo têm o mesmo fuso).
// Regra: cada ponto turístico ou atração tem o próprio card, mesmo quando fica perto do anterior.
//
// Parada (stop):
//   t      "HH:MM" em que a atividade começa
//   leg    como chegar até ela, saindo da parada anterior
//          { mode: walk|uber|car|bus|flight, min: [de, até], dist, price: [de, até], label, alt, leaveAt }
//   trip   a própria parada é um deslocamento que começa em t (mesmo formato de leg)
//   place  texto de busca no mapa; addr: endereço exibido; uberTo: destino do Uber
//   cost   texto do valor; paid: já pago (voucher)
//   meal   refeição garantida nesta parada: cafe | almoco | lanche | jantar
//
// Dia: welcome = título de boas-vindas [antes, destaque, depois]; magic = frase do dia.
// Endereços conferidos em 12/11/2026; onde as fontes divergem, a dica do card pede para conferir no mapa.

export const HOTEL = "Rua Pedro Candiago, 993, Gramado, RS";
const GATZZ = "Av. das Hortênsias, 3380, Gramado, RS";
const WALK_NEAR = { mode: "walk", min: [2, 5], dist: "pertinho" };

// Tarefas antes da viagem (aparecem na contagem regressiva).
export const BEFORE = [
  { date: "2026-11-20", t: "18:00", text: "Conferir se o pau de selfie tripé do Mercado Livre chegou." },
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
      { t: "08:45", title: "Café da manhã em casa", desc: "Café reforçado: o almoço só vai sair depois do raio-x. Remédios da manhã no horário de sempre.", meal: "cafe" },
      { t: "09:30", title: "Saída para Congonhas", desc: "Da casa do seu pai, na Vila Nova Cachoeirinha, de carro com a parente. A Marginal pode ter trânsito, então não atrasem.", place: "Aeroporto de Congonhas", trip: { mode: "car", min: [60, 60], dist: "25 km", label: "Carro" }, cost: "R$ 120" },
      { t: "10:45", title: "Chegada em Congonhas", desc: "Sem mala para despachar: sigam direto para o raio-x, com calma. Passo a passo na aba Voo.", place: "Aeroporto de Congonhas" },
      { t: "11:30", title: "Almoço no aeroporto", desc: "Na área de embarque, depois do raio-x, perto do portão. Comida de verdade, não só lanche.", place: "Aeroporto de Congonhas", leg: { mode: "walk", label: "Depois do raio-x" }, cost: "Outro dinheiro", meal: "almoco" },
      { t: "12:55", title: "Voo Azul para Porto Alegre", desc: "Chegada prevista às 14h40. Estejam no portão até 12h15.", leg: { mode: "walk", label: "Até o portão (confiram no painel)" }, paid: true },
      { t: "14:40", title: "Pouso em Porto Alegre", desc: "O carro do transfer espera no aeroporto. São cerca de 2 horas (115 km) até Gramado; quem enjoa vai no banco da frente.", place: "Aeroporto Salgado Filho Porto Alegre", leg: { mode: "flight", label: "Voo · 1h45" }, cost: "Transfer incluso" },
      { t: "15:00", title: "Lanche da tarde no transfer", desc: "O lanchinho da mochila no caminho para a serra: fruta, bolacha, castanha.", meal: "lanche" },
      { t: "17:00", title: "Chegada ao hotel e descanso", desc: "Check-in no Colina São Francisco.", addr: HOTEL, place: HOTEL, leg: { mode: "car", min: [120, 120], dist: "115 km", label: "Transfer" } },
      { t: "18:30", title: "Rissul (supermercado)", desc: "Água, frutas, suco e lanchinhos para o quarto, para a mochila e para o passeio no lago de quarta.", addr: "Av. Borges de Medeiros, 3994", place: "Supermercado Rissul Av. Borges de Medeiros 3994 Gramado", leg: { mode: "walk", min: [15, 15], dist: "1,2 km" }, cost: "Outro dinheiro" },
      { t: "19:00", title: "Jantar no centro", desc: "Antes do show, um buffet a quilo na Av. Borges de Medeiros, perto do Palácio dos Festivais. Outra opção: a Andesu Culinária Coreana pelo iFood, depois do show.", place: "restaurante buffet Avenida Borges de Medeiros Gramado", leg: { mode: "walk", label: "Pela Borges de Medeiros" }, tip: "Sugestão: conferir no mapa o mais perto do Palácio", cost: "Outro dinheiro", meal: "jantar" },
      { t: "20:00", title: "Show de Acendimento", desc: "No Palácio dos Festivais.", addr: "Av. Borges de Medeiros, 2697", place: "Palácio dos Festivais Gramado", leg: { mode: "walk", min: [5, 10], dist: "no centro" }, photo: "Palácio dos Festivais iluminado e as luzes do centro", cost: "Grátis" },
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
      { t: "07:00", title: "Café no hotel", desc: "Das 7h às 9h.", cost: "Incluso", meal: "cafe" },
      { t: "09:30", title: "Praça das Etnias", desc: "Pão com linguiça para começar o passeio. Fica na Av. Borges de Medeiros, ao lado da rodoviária.", place: "Praça das Etnias Gramado", leg: { mode: "walk", min: [15, 20], dist: "1,2 a 1,5 km" }, tip: "Bebedouro grátis aqui", cost: "Outro dinheiro" },
      { t: "09:50", title: "Vila de Natal", desc: "As casinhas de Natal montadas dentro da Praça das Etnias.", place: "Vila de Natal Praça das Etnias Gramado", leg: { mode: "walk", label: "Dentro da própria praça" }, photo: "As casinhas decoradas", cost: "Grátis" },
      { t: "10:05", title: "Casa do Papai Noel", desc: "Dentro da Vila de Natal. Funciona das 9h às 21h, segundo a programação do Natal Luz.", place: "Casa do Papai Noel Praça das Etnias Gramado", leg: { mode: "walk", label: "Dentro da Vila de Natal" }, photo: "Vocês duas com o Papai Noel", tip: "Não confundam com a Aldeia do Papai Noel, que é paga e fica em outro lugar", cost: "Grátis" },
      { t: "10:20", title: "Rua Torta", desc: "A rua sinuosa cheia de flores, em frente à Praça das Etnias. O nome oficial é Rua Emílio Sorgetz.", place: "Rua Torta Gramado", leg: { mode: "walk", min: [2, 2], dist: "em frente à praça" }, photo: "A curva da Rua Torta com as flores", cost: "Grátis" },
      { t: "10:35", title: "Museu Major Nicoletti", desc: "Museu pequeno sobre a história de Gramado.", addr: "Esquina da Av. Borges de Medeiros com a Rua Torta", place: "Museu Major José Nicoletti Filho Gramado", leg: { mode: "walk", min: [2, 2], dist: "no começo da Rua Torta" }, cost: "Grátis" },
      { t: "10:50", title: "Lago Joaquina Rita Bier", desc: "Volta a pé no calçadão do lago.", place: "Lago Joaquina Rita Bier Gramado", leg: { mode: "walk", min: [5, 5], dist: "menos de 500 m" }, cost: "Grátis" },
      { t: "11:20", title: "Igreja São Pedro", desc: "A Igreja Matriz, de pedra, no coração do centro. Daqui em diante tudo fica a 2 a 5 minutos a pé.", addr: "Av. Borges de Medeiros, centro", place: "Igreja Matriz São Pedro Gramado", leg: { mode: "walk", min: [15, 15], dist: "1,2 km" }, photo: "A fachada de pedra da igreja", tip: "Bebedouro em frente à igreja", cost: "Grátis" },
      { t: "11:30", title: "Relógio com termômetro", desc: "O relógio em estilo inglês que mostra a hora e a temperatura da cidade.", addr: "Na praça em frente à Igreja São Pedro", place: "Praça Major Nicoletti Gramado", leg: { mode: "walk", label: "Atravessando a rua, na praça" }, photo: "Vocês com o relógio marcando a temperatura", cost: "Grátis" },
      { t: "11:35", title: "Praça Major Nicoletti", desc: "A praça em frente à igreja, com bancos e jardins.", addr: "Av. Borges de Medeiros, em frente à Igreja São Pedro", place: "Praça Major Nicoletti Gramado", leg: { mode: "walk", label: "Na mesma praça do relógio" }, cost: "Grátis" },
      { t: "11:45", title: "Fonte do Amor Eterno", desc: "A fonte dos cadeados, ao lado da igreja.", addr: "Av. Borges de Medeiros, 2659", place: "Fonte do Amor Eterno Gramado", leg: WALK_NEAR, photo: "A fonte com os cadeados", cost: "Grátis" },
      { t: "11:55", title: "Rua Coberta", desc: "A rua de pedra coberta de vidro, com cafés e lojas. Entradas pela Borges de Medeiros e pela Rua Garibaldi.", place: "Rua Coberta Gramado", leg: WALK_NEAR, photo: "O corredor iluminado da Rua Coberta", cost: "Grátis" },
      { t: "12:05", title: "Cabine telefônica vermelha", desc: "A réplica das cabines de Londres.", addr: "Rua Garibaldi, 180", place: "Cabine Telefônica Inglesa Rua Garibaldi 180 Gramado", leg: { mode: "walk", min: [2, 5], dist: "saindo da Rua Coberta pela Garibaldi" }, photo: "Uma de cada vez dentro da cabine", cost: "Grátis" },
      { t: "12:12", title: "Pracinha da prefeitura", desc: "A praça em frente à Prefeitura de Gramado.", place: "Prefeitura Municipal de Gramado", leg: WALK_NEAR, tip: "Se o mapa não achar, perguntem a um morador: todo mundo conhece", cost: "Grátis" },
      { t: "12:20", title: "Jardim das Borboletas (Florybal)", desc: "O jardim escondido da Florybal, extensão do Jardim Encantado.", addr: "Av. Borges de Medeiros, 2771 (atrás da loja Casa dos Contos)", place: "Jardim Encantado Florybal Av. Borges de Medeiros 2771 Gramado", leg: WALK_NEAR, photo: "O jardim e as borboletas", cost: "Grátis" },
      { t: "12:30", title: "Naro Sushi", desc: "Buffet de almoço. Confiram o endereço no voucher.", place: "Naro Culinária Japonesa Gramado", leg: { mode: "walk", label: "No centro" }, paid: true, meal: "almoco" },
      { t: "13:45", title: "Vitrines da Borges de Medeiros", desc: "Passeio leve pelas lojas e chocolaterias, para fazer a digestão do buffet. Só olhar: o lanche fica para mais tarde.", place: "Avenida Borges de Medeiros Gramado", leg: { mode: "walk", label: "No centro" }, cost: "Livre" },
      { t: "14:45", title: "Trocar o voucher do Bustour", desc: "Na Loja Brocker. Sem isso não dá para embarcar amanhã!", addr: "Av. das Hortênsias, 1845, centro", place: "Av. das Hortênsias 1845 Gramado", leg: { mode: "walk", label: "Confiram a rota no mapa", alt: "ou Uber, se cansar" }, uberTo: "Av. das Hortênsias, 1845, Gramado, RS", tip: "Obrigatório" },
      { t: "15:05", title: "Mistério do Lago (Florybal)", desc: "Casa temática de chocolate com duendes e fadas em três andares.", addr: "Rua João Augusto Lied, 636", place: "Mistério do Lago Florybal Rua João Augusto Lied 636 Gramado", leg: { mode: "uber", min: [5, 5], dist: "2 km", price: [10, 15], alt: "ou a pé 25 min" }, uberTo: "Rua João Augusto Lied, 636, Gramado, RS", photo: "Os cenários de fadas", cost: "Grátis" },
      { t: "15:40", title: "Piquenique leve no Lago Negro", desc: "O lanche da tarde: fruta, cuca e suco comprados no Rissul na terça, à beira do lago.", place: "Lago Negro Gramado", leg: { mode: "walk", min: [2, 3], dist: "150 m" }, photo: "O Lago Negro e os pedalinhos", cost: "Já comprado", meal: "lanche" },
      { t: "18:30", title: "Jantar de lámen na Niji Store", desc: "Conveniência asiática no centro.", addr: "R. Mário Bertoluci, 70, loja 3", place: "Niji Store Rua Mário Bertoluci 70 Gramado", leg: { mode: "walk", min: [20, 20], dist: "1,5 km", alt: "ou Uber 5 min · R$ 10 a 15" }, uberTo: "Rua Mário Bertoluci, 70, Gramado, RS", cost: "Outro dinheiro", meal: "jantar" },
      { t: "19:15", title: "Sobremesa: fondue no pote da Mogusha", desc: "1 pote de fondue de chocolate para dividir, a caminho do show.", place: "Mogusha Avenida Borges de Medeiros Gramado", leg: { mode: "walk", label: "Na Borges de Medeiros, perto da Rua Coberta" }, tip: "São 3 lojas na Borges: escolham a mais perto no mapa", cost: "Cerca de R$ 25" },
      { t: "20:00", title: "Show de Acendimento", desc: "No Palácio dos Festivais.", addr: "Av. Borges de Medeiros, 2697", place: "Palácio dos Festivais Gramado", leg: { mode: "walk", label: "Pela Borges de Medeiros" }, photo: "Fachadas iluminadas do centro", cost: "Grátis" },
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
      { t: "07:00", title: "Café no hotel", desc: "Das 7h às 8h30. Não demorem!", cost: "Incluso", meal: "cafe" },
      { t: "09:00", title: "Ir à parada do Bustour", desc: "No Lago Negro. Levem o ingresso trocado ontem.", place: "Lago Negro Gramado", leg: { mode: "walk", min: [10, 10], dist: "800 m" } },
      { t: "09:19", title: "Bustour, rota vermelha", desc: "Até a Catedral de Pedra, em Canela. Chegada por volta das 10h.", place: "Catedral de Pedra Canela", trip: { mode: "bus", label: "Embarque às 9h19" }, paid: true },
      { t: "10:10", title: "Bondinhos Aéreos", desc: "Rota amarela do Bustour até os Bondinhos. Passeio das 10h30 às 12h30, sem o Aerozuum.", place: "Bondinhos Aéreos Canela", leg: { mode: "bus", label: "Rota amarela às 10h10" }, photo: "Cascata do Caracol vista do bondinho", paid: true },
      { t: "12:30", title: "Volta à Catedral", desc: "Rota amarela de volta. O horário está na placa da parada.", place: "Catedral de Pedra Canela", trip: { mode: "bus", label: "Rota amarela" }, paid: true },
      { t: "12:45", title: "Catedral de Pedra", desc: "Fotos da Catedral de dia, com calma.", place: "Catedral de Pedra Canela", photo: "A Catedral inteira, de longe, na praça em frente", cost: "Grátis" },
      { t: "13:00", title: "Almoço na Casa Aimée (buffet livre)", desc: "O buffet livre mais barato que achamos no centro de Canela: saladas, pratos quentes, grelhados e sobremesa.", addr: "Rua Augusto Pestana, 499, Canela", place: "Casa Aimée Restaurante Rua Augusto Pestana 499 Canela", leg: { mode: "walk", label: "No centro de Canela (confiram no mapa)" }, tip: "Preço no site deles: R$ 39,90 por pessoa; pode ter mudado", cost: "Cerca de R$ 40 cada", meal: "almoco" },
      { t: "14:00", title: "Alpen Park: trenó de montanha", desc: "Trenó avulso comprado na bilheteria. Ela controla a velocidade no freio. Com a labirintite, a primeira descida devagar. Fujam da montanha-russa e da torre de queda livre.", addr: "Rodovia Arnaldo Oppitz, 901, Canela", place: "Alpen Park Canela", leg: { mode: "uber", min: [10, 10], dist: "3 km", price: [15, 20] }, photo: "A descida de trenó", cost: "Sua mãe paga à parte" },
      { t: "15:15", title: "Lanche da tarde no Alpen Park", desc: "O lanchinho da mochila (comprado no Rissul na terça), sentadas, antes do Uber.", cost: "Já comprado", meal: "lanche" },
      { t: "15:30", title: "A caminho do Museu de Cera", desc: "Uber até o Dreamland.", place: "Dreamland Museu de Cera Gramado", trip: { mode: "uber", min: [15, 15], dist: "6 km", price: [20, 30] }, uberTo: "Dreamland Museu de Cera, Gramado, RS" },
      { t: "15:45", title: "Dreamland Museu de Cera", desc: "Visita até umas 17h15 (fecha às 18h30).", place: "Dreamland Museu de Cera Gramado", photo: "Personagens do Museu de Cera", paid: true },
      { t: "17:40", title: "Jantar no Rissul de Canela", desc: "Supermercado no centro de Canela: salgados, sanduíches e pratos da padaria e da rotisseria, na faixa dos R$ 20 a R$ 25. Aberto até as 21h.", addr: "Av. João Pessoa, 417, Canela", place: "Supper Rissul Av. João Pessoa 417 Canela", leg: { mode: "uber", min: [15, 15], dist: "6 km", price: [25, 35] }, uberTo: "Av. João Pessoa, 417, Canela, RS", tip: "Comprem também água para o show", cost: "Cerca de R$ 20 a 25 cada", meal: "jantar" },
      { t: "18:45", title: "Pegar lugar para o show", desc: "Caminhem até a Catedral com calma e escolham um bom lugar de frente para as torres.", place: "Catedral de Pedra Canela", leg: { mode: "walk", label: "Confiram a rota no mapa" }, tip: "Levem casaco: à noite esfria", cost: "Grátis" },
      { t: "20:30", title: "Sonho de Natal na Catedral", desc: "Show de luzes e Papai Noel descendo de rapel pelas torres.", place: "Catedral de Pedra Canela", leg: { mode: "walk", label: "Vocês já estão no lugar" }, photo: "A Catedral iluminada", cost: "Grátis" },
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
      { t: "07:00", title: "Café no hotel", desc: "Das 7h às 9h.", cost: "Incluso", meal: "cafe" },
      { t: "10:00", title: "Igreja do Relógio", desc: "A igreja luterana com a torre do relógio e jardim de hortênsias na frente. Não é a mesma Igreja São Pedro de quarta.", addr: "Av. das Hortênsias, 1350", place: "Igreja do Relógio Gramado", leg: { mode: "walk", min: [15, 20], dist: "1,2 a 1,5 km" }, photo: "A torre com as hortênsias na frente", tip: "O horário de visita por dentro varia; a fachada já vale a foto", cost: "Grátis" },
      { t: "10:30", title: "Vila de Natal (de novo, com calma)", desc: "As casinhas de Natal da Praça das Etnias, agora sem pressa.", place: "Vila de Natal Praça das Etnias Gramado", leg: { mode: "walk", label: "Confiram a rota no mapa" }, cost: "Grátis" },
      { t: "11:00", title: "Palco da Rua Coberta", desc: "Apresentações de Natal no palco da Rua Coberta.", place: "Rua Coberta Gramado", leg: { mode: "walk", min: [5, 10], dist: "400 a 800 m" }, cost: "Grátis" },
      { t: "11:40", title: "Praça do Moinho", desc: "A pracinha com o moinho, ao lado do Supermercado Nacional.", addr: "Av. Borges de Medeiros, esquina com a Rua Wilma Dinnebier", place: "Praça do Moinho Gramado", leg: { mode: "walk", label: "Pela Borges de Medeiros" }, photo: "O moinho", cost: "Grátis" },
      { t: "12:30", title: "Almoço no Dubai Espetaria", desc: "Alaminuta a partir de R$ 23,90.", addr: "Rua São Pedro, 502", place: "Dubai Espetaria e Hamburgueria Rua São Pedro 502 Gramado", leg: { mode: "walk", min: [5, 5], dist: "400 m" }, tip: "4 min da Igreja São Pedro; um cadastro antigo dá outro endereço, confiram no mapa", cost: "Outro dinheiro", meal: "almoco" },
      { t: "14:00", title: "Descanso no hotel", desc: "Recarregar as energias.", addr: HOTEL, place: HOTEL, leg: { mode: "walk", min: [15, 15], dist: "1,2 km", alt: "ou Uber 5 min · R$ 10 a 15" }, uberTo: HOTEL },
      { t: "15:00", title: "Parada de Natal", desc: "Na Av. Borges de Medeiros. Cheguem uns 20 min antes para pegar lugar.", place: "Av. Borges de Medeiros Gramado", leg: { mode: "walk", min: [15, 15], dist: "1,2 km", leaveAt: "14:25" }, photo: "Os carros da Parada", cost: "Grátis" },
      { t: "15:45", title: "Chocolate quente na MuKli", desc: "O lanche da tarde, depois da Parada. Abre das 8h30 às 20h. Leve: o fondue é às 18h.", addr: "Av. das Hortênsias, 1885", place: "MuKli Av. das Hortênsias 1885 Gramado", leg: { mode: "walk", label: "Confiram a rota no mapa", alt: "ou Uber · trânsito lento por causa da Parada" }, uberTo: "Av. das Hortênsias, 1885, Gramado, RS", cost: "Cerca de R$ 15 cada", meal: "lanche" },
      { t: "16:20", title: "Volta ao hotel", desc: "Descanso e banho para a noite.", addr: HOTEL, place: HOTEL, trip: { mode: "uber", min: [5, 10], label: "Uber", alt: "ou a pé, se estiverem perto" }, uberTo: HOTEL },
      { t: "17:15", title: "Uber até o Gatzz", desc: "Saiam no horário: o show começa às 18h.", addr: "Av. das Hortênsias, 3380", place: "Gatzz Gramado Av. das Hortênsias 3380", trip: { mode: "uber", min: [10, 15], dist: "3 km", price: [15, 25] }, uberTo: GATZZ },
      { t: "18:00", title: "Gatzz: fondue e show Bellepoque", desc: "Queijo, carne e chocolate. Primeira sessão (não a das 21h30).", place: "Gatzz Gramado", photo: "O salão do Gatzz", paid: true, meal: "jantar" },
      { t: "21:00", title: "Uber de volta ao hotel", desc: "À noite o preço costuma subir.", addr: HOTEL, place: HOTEL, trip: { mode: "uber", min: [10, 15], dist: "3 km", price: [15, 30] }, uberTo: HOTEL },
    ],
  },
  {
    date: "2026-11-28", tab: "Sáb 28", name: "Despedida",
    hint: "Última caminhada e volta para casa.",
    welcome: ["Até logo, ", "Gramado", ""],
    magic: "Guardem cada luz na memória: Gramado já está com saudade de vocês.",
    endAt: "21:00",
    stops: [
      { t: "07:00", title: "Café no hotel", desc: "Das 7h às 8h30.", cost: "Incluso", meal: "cafe" },
      { t: "08:45", title: "Última caminhada no Lago Negro", desc: "O lago de manhã, sem movimento.", place: "Lago Negro Gramado", leg: { mode: "walk", min: [10, 10], dist: "800 m" }, photo: "Lago Negro vazio de manhã", cost: "Grátis" },
      { t: "10:00", title: "Check-out", desc: "Confiram o quarto com a lista \"Antes de sair do hotel\", na aba Mala.", addr: HOTEL, place: HOTEL, leg: { mode: "walk", min: [10, 10], dist: "800 m" } },
      { t: "10:30", title: "Saída para o aeroporto", desc: "Transfer até o Aeroporto Salgado Filho, em Porto Alegre.", place: "Aeroporto Salgado Filho Porto Alegre", trip: { mode: "car", min: [120, 120], dist: "115 km", label: "Transfer" }, photo: "Os Pórticos na estrada, se passar por eles", cost: "Incluso" },
      { t: "12:30", title: "Chegada ao aeroporto", desc: "Direto para o raio-x, com calma.", place: "Aeroporto Salgado Filho Porto Alegre" },
      { t: "13:00", title: "Almoço no aeroporto", desc: "Na área de embarque, perto do portão.", place: "Aeroporto Salgado Filho Porto Alegre", leg: { mode: "walk", label: "Depois do raio-x" }, cost: "Outro dinheiro", meal: "almoco" },
      { t: "15:10", title: "Voo Azul para Congonhas", desc: "Estejam no portão até 14h30. Lanche da tarde: o lanchinho da mochila no voo.", leg: { mode: "walk", label: "Até o portão (confiram no painel)" }, paid: true, meal: "lanche" },
      { t: "17:00", title: "Chegada em Congonhas", desc: "Horário previsto; confiram no cartão de embarque. Quem vem buscar vocês já deve estar combinado.", place: "Aeroporto de Congonhas", leg: { mode: "flight", label: "Voo · cerca de 1h45" } },
      { t: "19:00", title: "Jantar em casa", desc: "Fim da viagem. Descansem: foi lindo!", meal: "jantar" },
    ],
  },
];
