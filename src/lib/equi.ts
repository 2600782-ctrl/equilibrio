import { EQUI_KNOWLEDGE } from "./data";

interface EquiAction {
  label: string;
  route: string;
}

interface EquiResponse {
  content: string;
  actions?: EquiAction[];
}

const NAVIGATION_KEYWORDS: Record<string, { response: string; route: string; label: string }> = {
  "registrar água|hidratação|beber|água|garrafa": {
    response: "Você pode registrar sua hidratação na página de Hidratação. Lá é possível adicionar quantidades rápidas ou personalizadas.",
    route: "/hidratacao",
    label: "Abrir Hidratação",
  },
  "sono|dormir|dormi|acord|descanso|insônia": {
    response: "Na página de Sono você pode registrar seus horários de dormir e acordar e acompanhar seu histórico.",
    route: "/sono",
    label: "Abrir Sono",
  },
  "pomodoro|foco|estudar|concentrar|concentração|estudo": {
    response: "A ferramenta Foco pode ajudar você a organizar períodos de concentração e pausas usando a Técnica Pomodoro.",
    route: "/foco",
    label: "Abrir Foco",
  },
  "movimento|exercício|caminhada|corrida|atividade física|academia": {
    response: "Na página de Movimento você pode registrar atividades físicas e acompanhar seu histórico.",
    route: "/movimento",
    label: "Abrir Movimento",
  },
  "ergonomia|postura|cadeira|mesa|monitor|teclado": {
    response: "Na página de Ergonomia você encontra dicas sobre organização do espaço de trabalho e um desafio interativo.",
    route: "/ergonomia",
    label: "Abrir Ergonomia",
  },
  "check-in|checkin|como estou|bem-estar": {
    response: "O Check-in permite refletir sobre aspectos da sua rotina. Não é uma avaliação médica — ajuda a identificar áreas que podem merecer atenção.",
    route: "/checkin",
    label: "Fazer Check-in",
  },
  "quiz|conhecimento|teste|pergunt": {
    response: "O Quiz testa seus conhecimentos sobre saúde e bem-estar. Escolha categoria e dificuldade!",
    route: "/quiz",
    label: "Abrir Quiz",
  },
  "pausa|respirar|respiração|relaxar": {
    response: "A Pausa Guiada oferece exercícios de respiração para momentos de pausa. Inspire e expire acompanhando a animação.",
    route: "/pausa-guiada",
    label: "Pausa Guiada",
  },
  "conteúdo|aprender|artigo|ler|biblioteca": {
    response: "Na seção Aprender você encontra artigos sobre sono, hidratação, movimento, ergonomia e mais.",
    route: "/aprender",
    label: "Abrir Aprender",
  },
  "conquista|conquistas|xp|nível|level": {
    response: "Na página de Conquistas você vê seu progresso, XP e badges desbloqueados.",
    route: "/conquistas",
    label: "Ver Conquistas",
  },
  "perfil|foto|nome|configura": {
    response: "Você pode editar seu perfil clicando na sua foto/nome no canto superior direito, ou acessando a página de Perfil.",
    route: "/perfil",
    label: "Meu Perfil",
  },
};

// Risk keywords
const RISK_KEYWORDS = ["suicíd", "matar", "morrer", "machucar", "cortar", "acabar com tudo", "não aguento mais", "desistir de viver"];

function isRiskSituation(input: string): boolean {
  const lower = input.toLowerCase();
  return RISK_KEYWORDS.some((k) => lower.includes(k));
}

function findNavigationMatch(input: string): { response: string; route: string; label: string } | null {
  const lower = input.toLowerCase();
  for (const [keywords, data] of Object.entries(NAVIGATION_KEYWORDS)) {
    const kwList = keywords.split("|");
    if (kwList.some((k) => lower.includes(k))) {
      return data;
    }
  }
  return null;
}

function findKnowledgeMatch(input: string): string | null {
  const lower = input.toLowerCase();
  const keywordMap: Record<string, string> = {
    "dormir|sono|descanso|insônia|noite": "sono",
    "água|beber|hidratação|hidratar|líquido": "hidratacao",
    "foco|concentra|pomodoro|estudar|estudo": "foco",
    "ergonomia|postura|cadeira|monitor|mesa": "ergonomia",
    "movimento|exercício|caminhada|corrida|atividade": "movimento",
    "check-in|checkin": "checkin",
    "quiz|conhecimento": "quiz",
    "pausa|respirar|relaxar": "pausa",
    "conquista|xp|nível": "conquistas",
    "perfil|foto|nome": "perfil",
  };

  for (const [keywords, key] of Object.entries(keywordMap)) {
    const kwList = keywords.split("|");
    if (kwList.some((k) => lower.includes(k))) {
      return EQUI_KNOWLEDGE[key] || null;
    }
  }
  return null;
}

export function getEquiResponse(input: string, _currentPage: string, userName: string): EquiResponse {
  // Check for risk situations first
  if (isRiskSituation(input)) {
    return {
      content: "O que você está relatando é muito importante. Se você está passando por um momento difícil, por favor, entre em contato com alguém que possa ajudar agora:\n\n📞 CVV (Centro de Valorização da Vida): 188\n💬 Chat do CVV: cvv.org.br\n📞 SAMU: 192\n📞 Emergência: 190\n\nVocê não precisa enfrentar isso sozinho(a). Buscar ajuda é um passo importante e corajoso.",
      actions: [],
    };
  }

  // Check for medical/diagnostic questions
  const medicalKeywords = ["tenho depressão", "tenho ansiedade", "diagnostic", "doença", "tratamento", "remédio", "medicamento"];
  const lower = input.toLowerCase();
  if (medicalKeywords.some((k) => lower.includes(k))) {
    return {
      content: "Essa é uma pergunta importante, mas está além do que posso responder. O Equilíbrio possui finalidade educativa e informativa — não realiza diagnósticos e não substitui acompanhamento de profissionais de saúde. Para questões sobre saúde mental ou física, recomendo buscar um profissional qualificado.",
      actions: [{ label: "Aprender sobre bem-estar", route: "/aprender" }],
    };
  }

  // Check for check-in result interpretation
  if (lower.includes("check-in falou") || lower.includes("checkin falou") || lower.includes("resultado do check-in") || lower.includes("minhas respostas")) {
    return {
      content: "O check-in reflete como você percebeu aspectos da sua rotina nos últimos dias. Se ele indicou que algo merece atenção, significa que suas respostas apontaram para dificuldades naquela área — não é um diagnóstico. Que tal explorar conteúdos sobre o tema?",
      actions: [{ label: "Aprender sobre sono", route: "/aprender" }, { label: "Fazer novo check-in", route: "/checkin" }],
    };
  }

  // Navigation/feature help
  const navMatch = findNavigationMatch(input);
  if (navMatch) {
    const isQuestion = lower.includes("como") || lower.includes("onde") || lower.includes("quero") || lower.includes("preciso") || lower.includes("?");
    if (isQuestion) {
      return {
        content: navMatch.response,
        actions: [{ label: navMatch.label, route: navMatch.route }],
      };
    }
  }

  // Knowledge content
  const knowledge = findKnowledgeMatch(input);
  if (knowledge) {
    const navMatch2 = findNavigationMatch(input);
    return {
      content: knowledge,
      actions: navMatch2 ? [{ label: navMatch2.label, route: navMatch2.route }] : undefined,
    };
  }

  // Greeting
  if (lower.includes("olá") || lower.includes("oi") || lower.includes("hey") || lower.includes("e aí")) {
    return {
      content: `Olá, ${userName}! Como posso ajudar? Você pode me perguntar sobre as ferramentas, conteúdos de bem-estar ou pedir ajuda para navegar no site.`,
      actions: [
        { label: "Fazer check-in", route: "/checkin" },
        { label: "Como funciona o Pomodoro?", route: "/foco" },
        { label: "Aprender sobre sono", route: "/aprender" },
      ],
    };
  }

  // Default
  return {
    content: "Posso ajudar com navegação no site, informações sobre as ferramentas (hidratação, sono, foco, ergonomia, movimento, pausa guiada) e conteúdos educativos sobre bem-estar. O que você gostaria de saber?",
    actions: [
      { label: "Explorar ferramentas", route: "/dashboard" },
      { label: "Aprender", route: "/aprender" },
    ],
  };
}

export function getEquiSuggestions(userName: string, currentPage: string): { label: string; route: string }[] {
  const base = [
    { label: "Quero fazer meu check-in", route: "/checkin" },
    { label: "Como funciona o Pomodoro?", route: "/foco" },
    { label: "Quero aprender sobre sono", route: "/aprender" },
  ];

  const pageSpecific: Record<string, { label: string; route: string }[]> = {
    "/hidratacao": [{ label: "Como registrar água?", route: "/hidratacao" }, { label: "Quanto devo beber?", route: "/aprender" }],
    "/sono": [{ label: "Dicas de sono", route: "/aprender" }],
    "/foco": [{ label: "Como começar um Pomodoro?", route: "/foco" }],
    "/checkin": [{ label: "O que é o check-in?", route: "/checkin" }],
    "/quiz": [{ label: "Categorias disponíveis", route: "/quiz" }],
  };

  const pageSuggestions = pageSpecific[currentPage] || [];
  return [...pageSuggestions, ...base].slice(0, 4);
}

export function getInitialGreeting(userName: string): EquiResponse {
  return {
    content: `Olá, ${userName}! Como posso ajudar?`,
    actions: [
      { label: "Quero fazer meu check-in", route: "/checkin" },
      { label: "Como funciona o Pomodoro?", route: "/foco" },
      { label: "Quero aprender sobre sono", route: "/aprender" },
      { label: "Onde estão meus registros?", route: "/dashboard" },
    ],
  };
}
