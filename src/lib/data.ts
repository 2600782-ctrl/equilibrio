// Educational content
export interface Article {
  id: string;
  title: string;
  category: string;
  description: string;
  readTime: string;
  sections: { heading: string; text: string }[];
  sources: { title: string; url: string }[];
}

export const ARTICLES: Article[] = [
  {
    id: "sleep-hygiene",
    title: "Higiene do Sono: Como Melhorar Seu Descanso",
    category: "Sono",
    description: "Entenda práticas baseadas em evidências para melhorar a qualidade do seu sono.",
    readTime: "5 min",
    sections: [
      { heading: "Por que o sono é importante?", text: "O sono é essencial para a consolidação de memórias, regulação emocional e recuperação física. Adultos geralmente se beneficiam de 7 a 9 horas de sono por noite, conforme recomendações de organizações como a Fundação Nacional do Sono (EUA) e a OMS." },
      { heading: "Práticas recomendadas", text: "Mantenha horários regulares de dormir e acordar, mesmo nos fins de semana. Limite a exposição a telas pelo menos 30 minutos antes de dormir. Mantenha o quarto escuro, silencioso e com temperatura agradável. Evite cafeína nas horas anteriores ao sono." },
      { heading: "Atenção", text: "Dificuldades persistentes de sono podem indicar a necessidade de avaliação profissional. O conteúdo desta plataforma tem caráter educativo e não substitui acompanhamento médico." },
    ],
    sources: [
      { title: "Ministério da Saúde - Sono e Saúde", url: "https://www.gov.br/saude" },
      { title: "Fundação Nacional do Sono (Sleep Foundation)", url: "https://www.sleepfoundation.org" },
      { title: "OMS - Saúde Mental", url: "https://www.who.int/health-topics/mental-health" },
    ],
  },
  {
    id: "hydration-basics",
    title: "Hidratação: A Importância da Água para o Organismo",
    category: "Hidratação",
    description: "Saiba por que a hidratação adequada é fundamental e como manter bons hábitos.",
    readTime: "4 min",
    sections: [
      { heading: "A água no corpo humano", text: "A água compõe aproximadamente 60% do corpo humano e participa de funções essenciais como regulação de temperatura, transporte de nutrientes e eliminação de resíduos." },
      { heading: "Quanto beber?", text: "Não existe uma quantidade universal ideal para todas as pessoas. As necessidades variam conforme peso, clima, nível de atividade física e outros fatores. Consulte um profissional de saúde para orientação personalizada." },
      { heading: "Dicas práticas", text: "Tenha sempre água acessível. Defina lembretes regulares. Observe a cor da urina como um indicador simples de hidratação — tonalidade muito escura pode indicar necessidade de maior ingestão de líquidos." },
    ],
    sources: [
      { title: "OPAS - Água e Saúde", url: "https://www.paho.org" },
      { title: "Fiocruz - Promoção da Saúde", url: "https://www.fiocruz.br" },
    ],
  },
  {
    id: "ergonomics-workspace",
    title: "Ergonomia no Trabalho: Organizando Seu Espaço",
    category: "Ergonomia",
    description: "Aprenda a configurar seu espaço de trabalho para maior conforto e produtividade.",
    readTime: "6 min",
    sections: [
      { heading: "O que é ergonomia?", text: "Ergonomia é a ciência que estuda a adaptação do trabalho às características do trabalhador, visando conforto, segurança e desempenho. No contexto de trabalho com computadores, envolve a organização do mobiliário e equipamentos." },
      { heading: "Monitor", text: "O topo do monitor deve estar na altura dos olhos ou levemente abaixo. A distância recomendada é de aproximadamente um braço de distância (40-70 cm). Evite reflexos e brilho excessivo na tela." },
      { heading: "Cadeira", text: "A cadeira deve oferecer suporte lombar adequado. Os pés devem ficar apoiados no chão ou em um suporte. Os cotovelos devem formar um ângulo de aproximadamente 90° ao digitar." },
      { heading: "Pausas", text: "Faça pausas regulares — recomenda-se pelo menos 5-10 minutos a cada hora de trabalho contínuo. Levante-se, alongue-se e descanse a visão olhando para objetos distantes." },
    ],
    sources: [
      { title: "Ministério do Trabalho - NR 17", url: "https://www.gov.br/trabalho-e-emprego" },
      { title: "WHO - Occupational Health", url: "https://www.who.int/health-topics/occupational-health" },
    ],
  },
  {
    id: "focus-pomodoro",
    title: "Técnica Pomodoro: Foco e Produtividade",
    category: "Foco",
    description: "Conheça a técnica Pomodoro e como ela pode ajudar na organização do tempo de estudo.",
    readTime: "4 min",
    sections: [
      { heading: "O que é a Técnica Pomodoro?", text: "Desenvolvida por Francesco Cirillo nos anos 1980, a técnica consiste em alternar períodos de trabalho focado (tradicionalmente 25 minutos) com pausas curtas (5 minutos). A cada quatro ciclos, recomenda-se uma pausa mais longa." },
      { heading: "Benefícios", text: "Ajuda a manter a concentração, reduz a procrastinação, proporciona sensação de progresso e previne o esgotamento mental ao incluir pausas regulares." },
      { heading: "Como adaptar", text: "Os tempos podem ser ajustados conforme suas necessidades. Algumas pessoas preferem períodos de 50 minutos com pausas de 10. O importante é encontrar um ritmo que funcione para você." },
    ],
    sources: [
      { title: "Francesco Cirillo - Pomodoro Technique", url: "https://francescocirillo.com/products/the-pomodoro-technique" },
    ],
  },
  {
    id: "movement-benefits",
    title: "Benefícios do Movimento para Saúde e Bem-Estar",
    category: "Movimento",
    description: "Descubra como a atividade física regular contribui para a saúde geral.",
    readTime: "5 min",
    sections: [
      { heading: "Movimento e saúde", text: "A atividade física regular está associada a benefícios para saúde cardiovascular, controle de peso, saúde mental, qualidade do sono e capacidade cognitiva. A OMS recomenda pelo menos 150 minutos de atividade moderada por semana para adultos." },
      { heading: "Começar devagar", text: "Se você não pratica atividade regularmente, comece com caminhadas curtas e aumente gradualmente. Até pequenas quantidades de movimento são melhores do que nenhuma." },
      { heading: "Variedade", text: "Diferentes tipos de atividade oferecem diferentes benefícios. Atividades aeróbicas melhoram condicionamento cardiovascular, exercícios de fortalecimento mantêm massa muscular e alongamentos contribuem para flexibilidade." },
    ],
    sources: [
      { title: "OMS - Atividade Física", url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity" },
      { title: "Ministério da Saúde - Guia de Atividade Física", url: "https://www.gov.br/saude" },
    ],
  },
  {
    id: "screen-time",
    title: "Uso de Telas: Equilíbrio e Cuidados",
    category: "Uso de telas",
    description: "Reflexões sobre o uso saudável de telas e dispositivos digitais.",
    readTime: "4 min",
    sections: [
      { heading: "Tempo de tela", text: "O uso excessivo de telas, especialmente antes de dormir, pode afetar a qualidade do sono e causar fadiga visual. No entanto, dispositivos digitais também são ferramentas importantes de trabalho, estudo e conexão social." },
      { heading: "Estratégias", text: "Utilize a regra 20-20-20: a cada 20 minutos, olhe para algo a 6 metros (20 pés) de distância por 20 segundos. Defina períodos sem tela, especialmente nas horas antes de dormir e durante as refeições." },
    ],
    sources: [
      { title: "Academia Americana de Oftalmologia", url: "https://www.aao.org" },
      { title: "OPAS - Uso de Tecnologia", url: "https://www.paho.org" },
    ],
  },
  {
    id: "emotional-wellbeing",
    title: "Bem-Estar Emocional: Cuidando da Mente",
    category: "Bem-estar emocional",
    description: "Informações sobre bem-estar emocional e quando buscar apoio.",
    readTime: "5 min",
    sections: [
      { heading: "O que é bem-estar emocional?", text: "Bem-estar emocional envolve a capacidade de lidar com as emoções do cotidiano, manter relações satisfatórias e adaptar-se a adversidades. Não significa estar sempre feliz, mas sim ter recursos para enfrentar desafios." },
      { heading: "Cuidados diários", text: "Pratique atividades que tragam satisfação. Mantenha conexões sociais. Reconheça e valide suas emoções. Estabeleça limites saudáveis. Pratique gratidão e auto-compaixão." },
      { heading: "Quando buscar ajuda", text: "Se sentimentos de tristeza, ansiedade ou desespero persistirem e afetarem significativamente o cotidiano, é importante buscar acompanhamento de um profissional de saúde mental. Não hesite em procurar ajuda — é um sinal de força, não de fraqueza." },
    ],
    sources: [
      { title: "OMS - Saúde Mental", url: "https://www.who.int/health-topics/mental-health" },
      { title: "Ministério da Saúde - Saúde Mental", url: "https://www.gov.br/saude" },
    ],
  },
];

// Quiz questions
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  source?: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Sono - Easy
  { id: "q1", question: "Quantas horas de sono são geralmente recomendadas para adultos?", options: ["3-5 horas", "5-6 horas", "7-9 horas", "10-12 horas"], correctIndex: 2, explanation: "Organizações como a Sleep Foundation recomendam 7-9 horas de sono para adultos.", category: "Sono", difficulty: "easy" },
  { id: "q2", question: "Qual hormônio é regulado durante o sono e influencia o ciclo circadiano?", options: ["Adrenalina", "Melatonina", "Insulina", "Cortisol"], correctIndex: 1, explanation: "A melatonina é o hormônio produzido pela glândula pineal que regula o ciclo sono-vigília.", category: "Sono", difficulty: "easy" },
  { id: "q3", question: "O uso de telas antes de dormir pode afetar o sono porque:", options: ["As telas são muito pesadas", "A luz azul pode interferir na produção de melatonina", "As telas fazem barulho", "Não tem nenhum efeito"], correctIndex: 1, explanation: "A luz emitida por telas, especialmente a luz azul, pode suprimir a produção de melatonina e dificultar o sono.", category: "Sono", difficulty: "easy" },
  // Sono - Medium
  { id: "q4", question: "O que é a privação de sono crônica?", options: ["Ficar acordado uma noite", "Dormir pouco durante várias noites consecutivas", "Dormir demais", "Ter insônia apenas aos finais de semana"], correctIndex: 1, explanation: "A privação crônica de sono ocorre quando há déficit acumulado de sono ao longo de vários dias ou semanas.", category: "Sono", difficulty: "medium" },
  // Hidratação - Easy
  { id: "q5", question: "Aproximadamente qual porcentagem do corpo humano é composta por água?", options: ["30%", "45%", "60%", "80%"], correctIndex: 2, explanation: "O corpo humano é composto por aproximadamente 60% de água, variando conforme idade, sexo e composição corporal.", category: "Hidratação", difficulty: "easy" },
  { id: "q6", question: "Qual é um sinal simples de que o corpo pode precisar de mais hidratação?", options: ["Pele muito clara", "Urina com cor muito escura", "Excesso de energia", "Apetite aumentado"], correctIndex: 1, explanation: "A cor da urina é um indicador simples de hidratação. Urina muito escura pode indicar necessidade de mais líquidos.", category: "Hidratação", difficulty: "easy" },
  // Hidratação - Medium
  { id: "q7", question: "A necessidade de hidratação depende de:", options: ["Apenas da idade", "Apenas do peso", "Múltiplos fatores como peso, clima e atividade física", "É igual para todas as pessoas"], correctIndex: 2, explanation: "As necessidades de hidratação variam conforme peso, clima, nível de atividade física e outros fatores individuais.", category: "Hidratação", difficulty: "medium" },
  // Ergonomia - Easy
  { id: "q8", question: "O topo do monitor deve estar posicionado:", options: ["Abaixo da linha da cintura", "Na altura dos olhos ou levemente abaixo", "Acima da cabeça", "A qualquer altura"], correctIndex: 1, explanation: "O topo do monitor na altura dos olhos ou levemente abaixo ajuda a manter uma postura adequada e reduzir esforço cervical.", category: "Ergonomia", difficulty: "easy" },
  // Ergonomia - Medium
  { id: "q9", question: "A regra 20-20-20 recomenda:", options: ["Trabalhar 20 horas seguidas", "A cada 20 min, olhar a 6m de distância por 20 segundos", "Blink 20 vezes por minuto", "Pausar 20 minutos a cada 20 segundos"], correctIndex: 1, explanation: "A regra 20-20-20 ajuda a prevenir fadiga visual: a cada 20 minutos, olhe para algo a cerca de 6 metros (20 pés) por 20 segundos.", category: "Ergonomia", difficulty: "medium" },
  // Foco - Easy
  { id: "q10", question: "Quem criou a Técnica Pomodoro?", options: ["Albert Einstein", "Francesco Cirillo", "Isaac Newton", "Stephen Covey"], correctIndex: 1, explanation: "A Técnica Pomodoro foi desenvolvida por Francesco Cirillo nos anos 1980.", category: "Foco", difficulty: "easy" },
  { id: "q11", question: "Na técnica Pomodoro tradicional, quanto tempo dura um período de foco?", options: ["10 minutos", "15 minutos", "25 minutos", "60 minutos"], correctIndex: 2, explanation: "O período de foco tradicional na técnica Pomodoro é de 25 minutos.", category: "Foco", difficulty: "easy" },
  // Foco - Medium
  { id: "q12", question: "Após quantos ciclos Pomodoro recomenda-se uma pausa mais longa?", options: ["2", "3", "4", "6"], correctIndex: 2, explanation: "Após 4 ciclos de Pomodoro, recomenda-se uma pausa mais longa (15-30 minutos).", category: "Foco", difficulty: "medium" },
  // Movimento - Easy
  { id: "q13", question: "A OMS recomenda pelo menos quantos minutos de atividade física moderada por semana?", options: ["30 minutos", "75 minutos", "150 minutos", "300 minutos"], correctIndex: 2, explanation: "A OMS recomenda pelo menos 150 minutos de atividade física moderada ou 75 minutos de atividade vigorosa por semana.", category: "Movimento", difficulty: "easy" },
  { id: "q14", question: "Qual destes é um benefício da atividade física regular?", options: ["Reduz a necessidade de sono", "Melhora a saúde cardiovascular", "Elimina a necessidade de pausas", "Substitui alimentação saudável"], correctIndex: 1, explanation: "A atividade física regular traz benefícios para saúde cardiovascular, mental, qualidade do sono e mais.", category: "Movimento", difficulty: "easy" },
  // Movimento - Hard
  { id: "q15", question: "O que é o efeito neurotrófico derivado do cérebro (BDNF)?", options: ["Um tipo de neurônio", "Uma proteína que apoiar a sobrevivência de neurônios e é estimulada pelo exercício", "Um hormônio do sono", "Um medicamento"], correctIndex: 1, explanation: "O BDNF é uma proteína importante para a sobrevivência e crescimento de neurônios, e sua produção é estimulada pelo exercício físico.", category: "Movimento", difficulty: "hard" },
  // Geral
  { id: "q16", question: "O que significa ergonomia?", options: ["Estudo do sono", "Ciência da adaptação do trabalho ao trabalhador", "Técnica de meditação", "Exercício físico"], correctIndex: 1, explanation: "Ergonomia é a ciência que estuda a adaptação do trabalho às características do trabalhador.", category: "Geral", difficulty: "easy" },
  { id: "q17", question: "Qual organização é referência global em diretrizes de saúde?", options: ["NASA", "OMS (Organização Mundial da Saúde)", "FMI", "UNESCO"], correctIndex: 1, explanation: "A Organização Mundial da Saúde (OMS) é a principal autoridade internacional em saúde pública.", category: "Geral", difficulty: "easy" },
  { id: "q18", question: "Pausas regulares durante o trabalho em computador são recomendadas porque:", options: ["Não são necessárias", "Previnem fadiga visual e muscular e melhoram a produtividade", "Apenas para comer", "São recomendadas apenas para idosos"], correctIndex: 1, explanation: "Pausas regulares ajudam a prevenir fadiga visual, tensão muscular e podem melhorar a produtividade e o foco.", category: "Geral", difficulty: "easy" },
  { id: "q19", question: "Qual prática pode ajudar na regulação emocional?", options: ["Ignorar emoções", "Reconhecer e validar emoções", "Suprimir sentimentos", "Não pensar nisso"], correctIndex: 1, explanation: "Reconhecer e validar emoções é uma prática que contribui para a regulação emocional e o bem-estar.", category: "Geral", difficulty: "medium" },
  { id: "q20", question: "A privação de sono pode afetar:", options: ["Apenas o humor", "Apenas a energia física", "Humor, cognição, imunidade e mais", "Nada significativo"], correctIndex: 2, explanation: "A privação de sono pode afetar múltiplos aspectos: humor, capacidade cognitiva, sistema imunológico, coordenação motora e mais.", category: "Sono", difficulty: "medium" },
];

// Check-in questions
export interface CheckinQuestion {
  id: string;
  question: string;
  category: string;
  options: string[];
  values: number[];
}

export const CHECKIN_QUESTIONS: CheckinQuestion[] = [
  { id: "c1", question: "Como você avalia seu descanso ao acordar nos últimos dias?", category: "Sono", options: ["Muito bom", "Bom", "Regular", "Ruim", "Muito ruim"], values: [5, 4, 3, 2, 1] },
  { id: "c2", question: "Como esteve sua energia para realizar suas atividades?", category: "Energia", options: ["Muito boa", "Boa", "Regular", "Baixa", "Muito baixa"], values: [5, 4, 3, 2, 1] },
  { id: "c3", question: "Como esteve sua capacidade de concentração?", category: "Foco", options: ["Muito boa", "Boa", "Regular", "Baixa", "Muito baixa"], values: [5, 4, 3, 2, 1] },
  { id: "c4", question: "Com que frequência você se sentiu sobrecarregado(a)?", category: "Sobrecarga", options: ["Nunca", "Raramente", "Às vezes", "Frequentemente", "Quase sempre"], values: [5, 4, 3, 2, 1] },
  { id: "c5", question: "Você conseguiu incluir momentos de movimento ou atividade física?", category: "Movimento", options: ["Frequentemente", "Algumas vezes", "Poucas vezes", "Não consegui"], values: [5, 4, 3, 2] },
  { id: "c6", question: "Você tem lembrado de se hidratar ao longo do dia?", category: "Hidratação", options: ["Quase sempre", "Frequentemente", "Às vezes", "Raramente"], values: [5, 4, 3, 2] },
  { id: "c7", question: "Durante períodos prolongados de estudo, trabalho ou uso de telas, você costuma fazer pausas?", category: "Pausas", options: ["Frequentemente", "Às vezes", "Raramente", "Nunca"], values: [5, 4, 3, 2] },
  { id: "c8", question: "Como você percebe seu bem-estar emocional nos últimos dias?", category: "Bem-estar emocional", options: ["Muito bom", "Bom", "Regular", "Ruim", "Muito ruim"], values: [5, 4, 3, 2, 1] },
  { id: "c9", question: "Você sente que conseguiu equilibrar suas atividades e momentos de descanso?", category: "Equilíbrio", options: ["Sim", "Na maior parte", "Mais ou menos", "Pouco", "Não"], values: [5, 4, 3, 2, 1] },
  { id: "c10", question: "Como você avalia sua rotina de forma geral nos últimos 7 dias?", category: "Percepção geral", options: ["Muito boa", "Boa", "Regular", "Ruim", "Muito ruim"], values: [5, 4, 3, 2, 1] },
];

// EQUI local knowledge base (fallback)
export const EQUI_KNOWLEDGE: Record<string, string> = {
  sono: "O sono é essencial para saúde. Adultos geralmente se beneficiam de 7-9 horas por noite. Mantenha horários regulares, limite telas antes de dormir e garanta um ambiente adequado. Dificuldades persistentes merecem avaliação profissional.",
  hidratacao: "A água é fundamental para o organismo. As necessidades variam por pessoa, peso, clima e atividade. Não existe uma meta universal. Observe sinais como a cor da urina e mantenha água sempre acessível.",
  foco: "A Técnica Pomodoro alterna períodos de trabalho focado (geralmente 25 min) com pausas curtas (5 min). A cada 4 ciclos, faça uma pausa mais longa. Você pode ajustar os tempos nas configurações.",
  ergonomia: "Ergonomia adapta o trabalho ao trabalhador. Posicione o monitor na altura dos olhos, use cadeira com suporte lombar, mantenha cotovelos em ~90° e faça pausas regulares. Use a regra 20-20-20 para os olhos.",
  movimento: "A atividade física traz benefícios para saúde cardiovascular, mental e cognitiva. A OMS recomenda pelo menos 150 minutos de atividade moderada por semana. Comece devagar e aumente gradualmente.",
  checkin: "O check-in permite refletir sobre aspectos da sua rotina e bem-estar. Não é uma avaliação médica ou psicológica. As respostas ajudam a identificar áreas que podem merecer atenção.",
  quiz: "O quiz testa seus conhecimentos sobre saúde e bem-estar. Escolha categoria e dificuldade. Respostas corretas rendem XP e conquistas!",
  pomodoro: "O Pomodoro é uma técnica de gestão de tempo. Defina um período de foco, trabalhe sem interrupções e faça pausas regulares. Configure os tempos em Configurações.",
  perfil: "Você pode editar seu nome e foto no perfil. Clique na sua foto ou nome no canto superior direito e selecione 'Meu Perfil'.",
  conquistas: "Conquistas são desbloqueadas ao usar a plataforma: criar perfil, completar quizzes, Pomodoros, check-ins e mais. Elas rendem XP e representam seu progresso na plataforma.",
  pausa: "A Pausa Guiada oferece exercícios de respiração para momentos de pausa. Inspire, segure e expire acompanhando a animação. Não substitui acompanhamento profissional.",
};

// Movement types
export const MOVEMENT_TYPES = [
  { id: "walking", label: "Caminhada", icon: "🚶" },
  { id: "running", label: "Corrida", icon: "🏃" },
  { id: "sport", label: "Esporte", icon: "⚽" },
  { id: "stretching", label: "Alongamento/Mobilidade", icon: "🧘" },
  { id: "other", label: "Outro", icon: "💪" },
];
