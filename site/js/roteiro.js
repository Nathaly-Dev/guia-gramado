// Roteiro da viagem: fonte única de horários, lugares, trajetos e valores.
// Horário de Brasília (Gramado e São Paulo têm o mesmo fuso).
// Regra: cada ponto turístico ou atração tem o próprio card, mesmo quando fica perto do anterior.
//
// Parada (stop), na ordem do caminho (do mais perto do hotel para o mais longe):
//   t      "HH:MM" só nas paradas com horário marcado (ingresso, show, voo, café do hotel).
//          Sem t, a parada segue o ritmo de vocês: aparece na ordem e vocês marcam "feito".
//   end    (opcional) até quando a parada fixa vale; depois disso ela conta como feita
//   leg    como chegar até ela, saindo da parada anterior
//          { mode: walk|uber|car|bus|flight, min: [de, até], dist, price: [de, até], label, alt, leaveAt }
//   trip   a própria parada é um deslocamento que começa em t (mesmo formato de leg)
//   place  texto de busca no mapa; addr: endereço exibido; uberTo: destino do Uber
//   cost   texto do valor; paid: já pago (voucher)
//   meal   refeição garantida nesta parada: cafe | almoco | lanche | jantar
//
// Dia: welcome = título de boas-vindas [antes, destaque, depois]; magic = frase do dia.
// Endereços conferidos em 12/11/2026. Distâncias e tempos a pé recalculados em 25/11/2026 a partir
// das coordenadas de cada lugar no mapa (caminho ≈ 1,35 × a linha reta; passo calmo, sem contar fotos).

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
      { t: "18:30", title: "Rissul (supermercado)", desc: "Água, frutas, suco e lanchinhos para o quarto, para a mochila e para o passeio no lago de quarta.", addr: "Av. Borges de Medeiros, 3994", place: "Supermercado Rissul Av. Borges de Medeiros 3994 Gramado", leg: { mode: "walk", min: [45, 60], dist: "3 km", alt: "ou Uber 8 min · R$ 12 a 18" }, uberTo: "Av. Borges de Medeiros, 3994, Gramado, RS", cost: "Outro dinheiro" },
      { t: "19:00", title: "Jantar no centro", desc: "Antes do show, um buffet a quilo na Av. Borges de Medeiros, perto do Palácio dos Festivais. Outra opção: a Andesu Culinária Coreana pelo iFood, depois do show.", place: "restaurante buffet Avenida Borges de Medeiros Gramado", leg: { mode: "walk", label: "Pela Borges de Medeiros" }, tip: "Sugestão: conferir no mapa o mais perto do Palácio", cost: "Outro dinheiro", meal: "jantar" },
      { t: "20:00", title: "Show de Acendimento", desc: "No Palácio dos Festivais.", addr: "Av. Borges de Medeiros, 2697", place: "Palácio dos Festivais Gramado", leg: { mode: "walk", min: [5, 10], dist: "no centro" }, photo: "Palácio dos Festivais iluminado e as luzes do centro", cost: "Grátis" },
      { t: "21:00", title: "Volta ao hotel", desc: "Descansar para amanhã.", addr: HOTEL, place: HOTEL, trip: { mode: "walk", min: [25, 35], dist: "1,8 km", alt: "ou Uber 5 min · R$ 10 a 15" }, uberTo: HOTEL },
    ],
  },
  {
    date: "2026-11-25", tab: "Qua 25", name: "Gramado a pé",
    hint: "Do hotel para o centro num caminho só: Lago Rita Bier, Rua Torta, Praça das Etnias e centro. À tarde, Lago Negro. À noite, luzes.",
    welcome: ["Que comece o ", "encanto", ""],
    magic: "Casinhas de Natal, chocolate quente e uma surpresa em cada esquina.",
    notes: ["A partir das 15h10, o check-in do voo de volta abre no app da Azul."],
    endAt: "22:00",
    stops: [
      { t: "07:00", end: "09:00", title: "Café no hotel", desc: "Das 7h às 9h.", cost: "Incluso", meal: "cafe" },
      { title: "Lago Joaquina Rita Bier", desc: "Volta a pé no calçadão do lago. É a primeira parada no caminho do hotel para o centro.", place: "Lago Joaquina Rita Bier Gramado", leg: { mode: "walk", min: [15, 20], dist: "1 km", label: "A pé, saindo do hotel" }, photo: "O lago com as araucárias", cost: "Grátis" },
      { title: "Museu Major Nicoletti", desc: "Museu pequeno e grátis sobre a história de Gramado, na esquina da Rua Torta com a Borges de Medeiros. Tem um mirante do lado de fora.", addr: "R. Emílio Sorgetz, 234 (início da Rua Torta)", place: "Museu Major José Nicoletti Filho Gramado", leg: { mode: "walk", min: [10, 15], dist: "800 m" }, tip: "Quarta abre das 9h às 11h30 e das 13h30 às 17h30. Se estiver fechado, vejam o mirante de fora", cost: "Grátis" },
      { title: "Rua Torta", desc: "A rua sinuosa cheia de flores. O nome oficial é Rua Emílio Sorgetz.", place: "Rua Torta Gramado", leg: { mode: "walk", min: [1, 2], dist: "100 m" }, photo: "A curva da Rua Torta com as flores", cost: "Grátis" },
      { title: "Praça das Etnias", desc: "Pão com linguiça e cuca, em frente à Rua Torta, na Av. Borges de Medeiros.", addr: "Av. Borges de Medeiros, 1848", place: "Praça das Etnias Gramado", leg: { mode: "walk", min: [1, 2], dist: "100 m" }, tip: "Bebedouro grátis aqui", cost: "Outro dinheiro" },
      { title: "Vila de Natal", desc: "As casinhas de Natal montadas dentro da Praça das Etnias.", place: "Vila de Natal Praça das Etnias Gramado", leg: { mode: "walk", label: "Dentro da própria praça" }, photo: "As casinhas decoradas", cost: "Grátis" },
      { title: "Casa do Papai Noel", desc: "Dentro da Vila de Natal. Funciona das 9h às 21h, segundo a programação do Natal Luz.", place: "Casa do Papai Noel Praça das Etnias Gramado", leg: { mode: "walk", label: "Dentro da Vila de Natal" }, photo: "Vocês duas com o Papai Noel", tip: "Não confundam com a Aldeia do Papai Noel, que é paga e fica em outro lugar", cost: "Grátis" },
      { title: "Trocar o voucher do Bustour", desc: "Na Loja Brocker, subindo a Borges de Medeiros em direção ao centro. Sem isso não dá para embarcar amanhã!", addr: "Av. das Hortênsias, 1845", place: "Loja Brocker Turismo Av. das Hortênsias 1845 Gramado", leg: { mode: "walk", min: [8, 10], dist: "500 m" }, tip: "Obrigatório. Aberta das 7h30 às 20h", cost: "Já pago" },
      { title: "Cabine telefônica vermelha", desc: "A réplica das cabines de Londres, virando a esquina na Rua Garibaldi.", addr: "Rua Garibaldi, 180", place: "Cabine Telefônica Inglesa Rua Garibaldi 180 Gramado", leg: { mode: "walk", min: [2, 3], dist: "150 m" }, photo: "Uma de cada vez dentro da cabine", tip: "Se tiver fila, sigam e voltem depois", cost: "Grátis" },
      { title: "Pracinha da prefeitura", desc: "A praça em frente à Prefeitura de Gramado, de frente para a cabine.", addr: "Av. das Hortênsias, 2029", place: "Prefeitura Municipal de Gramado", leg: { mode: "walk", min: [1, 2], dist: "100 m" }, cost: "Grátis" },
      { title: "Rua Coberta", desc: "A rua de pedra coberta de vidro, com cafés e lojas.", place: "Rua Coberta Gramado", leg: { mode: "walk", min: [5, 6], dist: "300 m" }, photo: "O corredor iluminado da Rua Coberta", cost: "Grátis" },
      { title: "Igreja São Pedro", desc: "A Igreja Matriz, de pedra, no coração do centro.", addr: "Av. Borges de Medeiros, 2659", place: "Igreja Matriz São Pedro Gramado", leg: { mode: "walk", min: [2, 3], dist: "100 m" }, photo: "A fachada de pedra da igreja", tip: "Bebedouro em frente à igreja", cost: "Grátis" },
      { title: "Relógio com termômetro", desc: "O relógio em estilo inglês que mostra a hora e a temperatura da cidade.", addr: "Na praça em frente à Igreja São Pedro", place: "Praça Major Nicoletti Gramado", leg: { mode: "walk", label: "Atravessando a rua, na praça" }, photo: "Vocês com o relógio marcando a temperatura", cost: "Grátis" },
      { title: "Praça Major Nicoletti", desc: "A praça em frente à igreja, com bancos e jardins.", addr: "Av. Borges de Medeiros, em frente à Igreja São Pedro", place: "Praça Major Nicoletti Gramado", leg: { mode: "walk", label: "Na mesma praça do relógio" }, cost: "Grátis" },
      { title: "Fonte do Amor Eterno", desc: "A fonte dos cadeados, ao lado da igreja.", addr: "Av. Borges de Medeiros, 2659", place: "Fonte do Amor Eterno Gramado", leg: WALK_NEAR, photo: "A fonte com os cadeados", cost: "Grátis" },
      { title: "Jardim das Borboletas (Florybal)", desc: "O jardim escondido da Florybal, ao lado e nos fundos da loja.", addr: "Av. Borges de Medeiros, 2771", place: "Jardim Florybal Av. Borges de Medeiros 2771 Gramado", leg: { mode: "walk", min: [2, 3], dist: "150 m" }, photo: "O jardim e as borboletas", cost: "Grátis" },
      { t: "12:30", end: "14:45", title: "Naro Sushi", desc: "Buffet de almoço, das 11h45 às 14h45. Fica numa rua lateral, a 2 quadras da igreja.", addr: "R. Sen. Salgado Filho, 190", place: "Narō Culinária Japonesa R. Sen. Salgado Filho 190 Gramado", leg: { mode: "walk", min: [5, 6], dist: "300 m" }, tip: "Se atrasarem, tudo bem: o buffet vai até 14h45", paid: true, meal: "almoco" },
      { title: "Vitrines da Borges de Medeiros", desc: "Passeio leve pelas lojas e chocolaterias, para fazer a digestão do buffet. Só olhar: o lanche fica para mais tarde.", place: "Avenida Borges de Medeiros Gramado", leg: { mode: "walk", label: "No centro" }, cost: "Livre" },
      { title: "Mistério do Lago (Florybal)", desc: "Casa temática de chocolate com duendes e fadas em três andares, colada no Lago Negro.", addr: "Rua João Augusto Lied, 636", place: "Mistério do Lago Florybal Rua João Augusto Lied 636 Gramado", leg: { mode: "uber", min: [8, 10], dist: "3 km", price: [12, 18], alt: "ou a pé 45 a 55 min" }, uberTo: "Rua João Augusto Lied, 636, Gramado, RS", photo: "Os cenários de fadas", cost: "Grátis" },
      { title: "Piquenique leve no Lago Negro", desc: "O lanche da tarde: fruta, cuca e suco comprados no Rissul na terça, à beira do lago.", place: "Lago Negro Gramado", leg: { mode: "walk", min: [2, 3], dist: "150 m" }, photo: "O Lago Negro e os pedalinhos", tip: "O hotel fica a 15 a 20 min a pé daqui: dá para descansar lá antes do jantar", cost: "Já comprado", meal: "lanche" },
      { title: "Jantar de lámen na Niji Store", desc: "Conveniência asiática no centro. Aberta até as 21h.", addr: "R. Mário Bertoluci, 70, loja 3", place: "Niji Store Rua Mário Bertoluci 70 Gramado", leg: { mode: "uber", min: [8, 10], dist: "3 km", price: [12, 18], alt: "ou a pé 45 a 55 min" }, uberTo: "Rua Mário Bertoluci, 70, Gramado, RS", cost: "Outro dinheiro", meal: "jantar" },
      { title: "Sobremesa: fondue no pote da Mogusha", desc: "1 pote de fondue de chocolate para dividir, a caminho do show.", addr: "Av. Borges de Medeiros, 2480", place: "Mogusha Fondue no Pote Av. Borges de Medeiros 2480 Gramado", leg: { mode: "walk", min: [12, 15], dist: "800 m" }, tip: "Aberta até as 22h", cost: "Cerca de R$ 25" },
      { t: "20:00", end: "21:00", title: "Show de Acendimento", desc: "No Palácio dos Festivais.", addr: "Av. Borges de Medeiros, 2697", place: "Palácio dos Festivais Gramado", leg: { mode: "walk", min: [4, 5], dist: "250 m" }, photo: "Fachadas iluminadas do centro", cost: "Grátis" },
      { title: "Volta ao hotel", desc: "Descansar: amanhã o café é mais cedo.", addr: HOTEL, place: HOTEL, trip: { mode: "walk", min: [25, 35], dist: "1,8 km", alt: "ou Uber 5 min · R$ 10 a 15" }, uberTo: HOTEL },
    ],
  },
  {
    date: "2026-11-26", tab: "Qui 26", name: "Canela, trenó e Sonho de Natal",
    hint: "Dia de horários do Bustour. Se sua mãe ficar cansada ou tonta, pulem o show da noite.",
    welcome: ["Um dia ", "inesquecível", ""],
    magic: "A cascata vista lá do alto, uma descida de trenó e o Papai Noel descendo da Catedral.",
    notes: ["Façam o check-in do voo de volta no app da Azul, se ainda não fizeram."],
    endAt: "22:00",
    stops: [
      { t: "07:00", end: "08:30", title: "Café no hotel", desc: "Das 7h às 8h30. Não demorem!", cost: "Incluso", meal: "cafe" },
      { t: "09:00", end: "09:19", title: "Ir à parada do Bustour", desc: "No Lago Negro. Levem o ingresso trocado ontem.", place: "Lago Negro Gramado", leg: { mode: "walk", min: [15, 20], dist: "1,1 km" }, tip: "Saiam do hotel até 8h40 para não perder o ônibus das 9h19" },
      { t: "09:19", end: "10:10", title: "Bustour, rota vermelha", desc: "Até a Catedral de Pedra, em Canela. Chegada por volta das 10h.", place: "Catedral de Pedra Canela", trip: { mode: "bus", label: "Embarque às 9h19" }, paid: true },
      { t: "10:10", end: "12:30", title: "Bondinhos Aéreos", desc: "Rota amarela do Bustour até os Bondinhos. Passeio das 10h30 às 12h30, sem o Aerozuum.", place: "Bondinhos Aéreos Canela", leg: { mode: "bus", label: "Rota amarela às 10h10" }, photo: "Cascata do Caracol vista do bondinho", paid: true },
      { t: "12:30", end: "12:45", title: "Volta à Catedral", desc: "Rota amarela de volta. O horário está na placa da parada.", place: "Catedral de Pedra Canela", trip: { mode: "bus", label: "Rota amarela" }, paid: true },
      { title: "Catedral de Pedra", desc: "Fotos da Catedral de dia, com calma.", place: "Catedral de Pedra Canela", photo: "A Catedral inteira, de longe, na praça em frente", cost: "Grátis" },
      { title: "Almoço na Casa Aimée (buffet livre)", desc: "O buffet livre mais barato que achamos no centro de Canela: saladas, pratos quentes, grelhados e sobremesa.", addr: "Rua Augusto Pestana, 499, Canela", place: "Casa Aimée Restaurante Rua Augusto Pestana 499 Canela", leg: { mode: "walk", min: [5, 7], dist: "300 m", label: "A pé, a uma quadra da Catedral" }, tip: "Preço no site deles: R$ 39,90 por pessoa; pode ter mudado", cost: "Cerca de R$ 40 cada", meal: "almoco" },
      { title: "Alpen Park: trenó de montanha", desc: "Trenó avulso comprado na bilheteria. Ela controla a velocidade no freio. Com a labirintite, a primeira descida devagar. Fujam da montanha-russa e da torre de queda livre.", addr: "Rodovia Arnaldo Oppitz, 901, Canela", place: "Alpen Park Canela", leg: { mode: "uber", min: [8, 10], dist: "3 km", price: [15, 20] }, uberTo: "Alpen Park, Canela, RS", photo: "A descida de trenó", tip: "Fecha às 17h", cost: "Sua mãe paga à parte" },
      { title: "Lanche da tarde no Alpen Park", desc: "O lanchinho da mochila (comprado no Rissul na terça), sentadas, antes do Uber.", cost: "Já comprado", meal: "lanche" },
      { t: "15:45", end: "17:15", title: "Dreamland Museu de Cera", desc: "Visita até umas 17h15 (fecha às 18h30). Fica na Av. das Hortênsias, no caminho entre Canela e Gramado.", addr: "Av. das Hortênsias, 5507, Gramado", place: "Dreamland Museu de Cera Gramado", leg: { mode: "uber", min: [15, 20], dist: "8 km", price: [25, 35] }, uberTo: "Dreamland Museu de Cera, Gramado, RS", photo: "Personagens do Museu de Cera", paid: true },
      { title: "Jantar no Rissul de Canela", desc: "Supermercado no centro de Canela: salgados, sanduíches e pratos da padaria e da rotisseria, na faixa dos R$ 20 a R$ 25. Aberto até as 21h.", addr: "Rua João Pessoa, 417, Canela", place: "Rissul Rua João Pessoa 417 Canela", leg: { mode: "uber", min: [10, 15], dist: "5 km", price: [20, 30] }, uberTo: "Rua João Pessoa, 417, Canela, RS", tip: "Comprem também água para o show", cost: "Cerca de R$ 20 a 25 cada", meal: "jantar" },
      { t: "18:45", end: "20:30", title: "Pegar lugar para o show", desc: "Caminhem até a Catedral com calma e escolham um bom lugar de frente para as torres.", place: "Catedral de Pedra Canela", leg: { mode: "walk", min: [15, 20], dist: "1 km" }, tip: "Levem casaco: à noite esfria", cost: "Grátis" },
      { t: "20:30", end: "21:30", title: "Sonho de Natal na Catedral", desc: "Show de luzes e Papai Noel descendo de rapel pelas torres.", place: "Catedral de Pedra Canela", leg: { mode: "walk", label: "Vocês já estão no lugar" }, photo: "A Catedral iluminada", cost: "Grátis" },
      { title: "Uber de volta ao hotel", desc: "Depois do show. À noite o preço costuma subir.", addr: HOTEL, place: HOTEL, trip: { mode: "uber", min: [20, 25], dist: "10 km", price: [35, 50] }, uberTo: HOTEL },
    ],
  },
  {
    date: "2026-11-27", tab: "Sex 27", name: "Último dia: lago, centro, Parada e Gatzz",
    hint: "Saída do hotel às 10h. Lago Negro com calma e piquenique, centro de norte a sul, banho no hotel, Parada às 16h e Gatzz direto do centro.",
    welcome: ["Gramado em ", "clima de festa", ""],
    magic: "Um dia para guardar no coração, com cheirinho de chocolate no ar.",
    notes: ["Arrumem a mala hoje à noite: o check-out é amanhã às 10h."],
    endAt: "23:00",
    stops: [
      { t: "07:00", end: "09:00", title: "Café no hotel", desc: "Das 7h às 9h.", cost: "Incluso", meal: "cafe" },
      { title: "Lago Negro, com calma", desc: "Agora sem pressa, já que na quinta foi rápido. Volta completa no lago e pedalinho, se quiserem.", place: "Lago Negro Gramado", leg: { mode: "walk", min: [15, 20], dist: "1,1 km", label: "A pé, saindo do hotel às 10h" }, photo: "O lago com as árvores refletidas", cost: "Grátis" },
      { title: "Mistério do Lago (Florybal)", desc: "Casa temática de chocolate com duendes e fadas em três andares, colada no Lago Negro.", addr: "Rua João Augusto Lied, 636", place: "Mistério do Lago Florybal Rua João Augusto Lied 636 Gramado", leg: { mode: "walk", min: [2, 3], dist: "150 m" }, photo: "Os cenários de fadas", cost: "Grátis" },
      { title: "Piquenique no Lago Negro", desc: "O almoço: o lanche de vocês, num banco de frente para o lago.", place: "Lago Negro Gramado", leg: { mode: "walk", label: "De volta ao lago" }, cost: "Já comprado", meal: "almoco" },
      { title: "Niji Store", desc: "Conveniência asiática no centro. Por volta das 12h, Uber até aqui e daqui em diante tudo a pé, descendo até a Parada.", addr: "R. Mário Bertoluci, 70, loja 3", place: "Niji Store Rua Mário Bertoluci 70 Gramado", leg: { mode: "uber", min: [8, 10], dist: "3 km", price: [12, 18], alt: "ou a pé 45 a 55 min" }, uberTo: "Rua Mário Bertoluci, 70, Gramado, RS", cost: "Outro dinheiro" },
      { title: "Fonte do Amor Eterno", desc: "A fonte dos cadeados, ao lado da Igreja São Pedro.", addr: "Av. Borges de Medeiros, 2659", place: "Fonte do Amor Eterno Gramado", leg: { mode: "walk", min: [8, 10], dist: "600 m" }, photo: "A fonte com os cadeados", cost: "Grátis" },
      { title: "Igreja do Relógio", desc: "A igreja luterana com a torre do relógio e hortênsias na frente.", addr: "Av. Borges de Medeiros com Av. das Hortênsias, 1350", place: "Igreja do Relógio Gramado", leg: { mode: "walk", min: [5, 6], dist: "300 m" }, photo: "A torre com as hortênsias na frente", tip: "Na sexta, por dentro só até 11h: fica a foto da fachada", cost: "Grátis" },
      { title: "Praça do Moinho", desc: "A pracinha com o moinho de madeira e lojinhas, em frente ao Hard Rock.", addr: "R. Wilma Dinnebier, 157 (esquina com a Borges de Medeiros)", place: "Praça do Moinho Gramado", leg: { mode: "walk", min: [6, 8], dist: "400 m" }, photo: "O moinho", tip: "Se já entraram nela, sigam direto para o museu", cost: "Grátis" },
      { title: "Museu Major Nicoletti", desc: "Museu pequeno e grátis sobre a história de Gramado, no início da Rua Torta. Tem um mirante do lado de fora.", addr: "R. Emílio Sorgetz, 234 (início da Rua Torta)", place: "Museu Major José Nicoletti Filho Gramado", leg: { mode: "walk", min: [1, 2], dist: "100 m" }, tip: "Fecha para almoço das 11h30 às 13h30. Cheguem a partir das 13h30", cost: "Grátis" },
      { title: "Uber para o hotel: banho e descanso", desc: "Descansar as pernas e já se arrumar para o Gatzz: depois da Parada vocês vão direto para lá.", addr: HOTEL, place: HOTEL, trip: { mode: "uber", min: [5, 10], dist: "2 km", price: [10, 15], alt: "ou a pé 30 a 35 min" }, uberTo: HOTEL },
      { t: "15:30", end: "15:45", title: "Uber de volta ao centro", desc: "Já arrumadas para o Gatzz. Desçam perto do Palácio dos Festivais.", place: "Palácio dos Festivais Gramado", trip: { mode: "uber", min: [5, 10], dist: "2 km", price: [10, 15] }, uberTo: "Palácio dos Festivais, Av. Borges de Medeiros, 2697, Gramado, RS" },
      { title: "Chocolate quente na MuKli", desc: "O lanche da tarde, antes da Parada. Fica na Av. das Hortênsias, ao lado da Loja Brocker, bem perto de onde a Parada começa. Peçam pequeno: o fondue vem às 18h.", addr: "Av. das Hortênsias, 1885", place: "Mukli Alfajores Av. das Hortênsias 1885 Gramado", leg: { mode: "walk", min: [3, 5], dist: "200 m" }, tip: "Se tiver fila, pulem: a Parada é a prioridade", cost: "Cerca de R$ 15 cada", meal: "lanche" },
      { t: "16:00", end: "17:15", title: "Parada de Natal", desc: "Começa na Grande Árvore Natalina, na esquina da Av. das Hortênsias com a Borges de Medeiros, vai até a Rua Augusto Zatti e volta. Na ida tem um flashmob em frente ao Palácio dos Festivais.", place: "Palácio dos Festivais Gramado", leg: { mode: "walk", min: [2, 3], dist: "150 m" }, photo: "O flashmob em frente ao Palácio", tip: "Fiquem em frente ao Palácio para ver o flashmob. Se chover, a Parada acontece na Rua Coberta", cost: "Grátis" },
      { t: "17:20", end: "18:00", title: "Uber até o Gatzz", desc: "Direto do centro, já arrumadas. O show começa às 18h.", addr: "Av. das Hortênsias, 3380", place: "Gatzz Gramado Av. das Hortênsias 3380", trip: { mode: "uber", min: [5, 10], dist: "2,5 km", price: [10, 20] }, uberTo: GATZZ },
      { t: "18:00", end: "21:00", title: "Gatzz: fondue e show Bellepoque", desc: "Queijo, carne e chocolate. Primeira sessão (não a das 21h30).", place: "Gatzz Gramado", photo: "O salão do Gatzz", paid: true, meal: "jantar" },
      { title: "Uber de volta ao hotel", desc: "À noite o preço costuma subir.", addr: HOTEL, place: HOTEL, trip: { mode: "uber", min: [10, 15], dist: "3,5 km", price: [15, 30] }, uberTo: HOTEL },
    ],
  },
  {
    date: "2026-11-28", tab: "Sáb 28", name: "Despedida",
    hint: "Última caminhada e volta para casa.",
    welcome: ["Até logo, ", "Gramado", ""],
    magic: "Guardem cada luz na memória: Gramado já está com saudade de vocês.",
    endAt: "21:00",
    stops: [
      { t: "07:00", end: "08:30", title: "Café no hotel", desc: "Das 7h às 8h30.", cost: "Incluso", meal: "cafe" },
      { title: "Última caminhada no Lago Negro", desc: "O lago de manhã, sem movimento. Voltem a tempo do check-out às 10h.", place: "Lago Negro Gramado", leg: { mode: "walk", min: [15, 20], dist: "1,1 km" }, photo: "Lago Negro vazio de manhã", cost: "Grátis" },
      { t: "10:00", end: "10:30", title: "Check-out", desc: "Confiram o quarto com a lista \"Antes de sair do hotel\", na aba Mala.", addr: HOTEL, place: HOTEL, leg: { mode: "walk", min: [15, 20], dist: "1,1 km" } },
      { t: "10:30", end: "12:30", title: "Saída para o aeroporto", desc: "Transfer até o Aeroporto Salgado Filho, em Porto Alegre.", place: "Aeroporto Salgado Filho Porto Alegre", trip: { mode: "car", min: [120, 120], dist: "115 km", label: "Transfer" }, photo: "Os Pórticos na estrada, se passar por eles", cost: "Incluso" },
      { t: "12:30", end: "13:00", title: "Chegada ao aeroporto", desc: "Direto para o raio-x, com calma.", place: "Aeroporto Salgado Filho Porto Alegre" },
      { t: "13:00", end: "14:30", title: "Almoço no aeroporto", desc: "Na área de embarque, perto do portão.", place: "Aeroporto Salgado Filho Porto Alegre", leg: { mode: "walk", label: "Depois do raio-x" }, cost: "Outro dinheiro", meal: "almoco" },
      { t: "15:10", end: "17:00", title: "Voo Azul para Congonhas", desc: "Estejam no portão até 14h30. Lanche da tarde: o lanchinho da mochila no voo.", leg: { mode: "walk", label: "Até o portão (confiram no painel)" }, paid: true, meal: "lanche" },
      { t: "17:00", end: "19:00", title: "Chegada em Congonhas", desc: "Horário previsto; confiram no cartão de embarque. Quem vem buscar vocês já deve estar combinado.", place: "Aeroporto de Congonhas", leg: { mode: "flight", label: "Voo · cerca de 1h45" } },
      { t: "19:00", end: "21:00", title: "Jantar em casa", desc: "Fim da viagem. Descansem: foi lindo!", meal: "jantar" },
    ],
  },
];
