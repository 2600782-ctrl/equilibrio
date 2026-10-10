"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, ExternalLink } from "lucide-react";

const SOURCES = [
  {
    category: "Saúde geral",
    items: [
      { title: "Organização Mundial da Saúde (OMS)", url: "https://www.who.int" },
      { title: "OPAS — Organização Pan-Americana da Saúde", url: "https://www.paho.org" },
      { title: "Ministério da Saúde do Brasil", url: "https://www.gov.br/saude" },
      { title: "Fiocruz — Fundação Oswaldo Cruz", url: "https://www.fiocruz.br" },
    ],
  },
  {
    category: "Sono",
    items: [
      { title: "Sleep Foundation", url: "https://www.sleepfoundation.org" },
      { title: "OMS — Saúde Mental e Sono", url: "https://www.who.int/health-topics/mental-health" },
    ],
  },
  {
    category: "Hidratação",
    items: [
      { title: "OPAS — Água e Saúde", url: "https://www.paho.org" },
    ],
  },
  {
    category: "Ergonomia",
    items: [
      { title: "Ministério do Trabalho — NR 17", url: "https://www.gov.br/trabalho-e-emprego" },
      { title: "WHO — Occupational Health", url: "https://www.who.int/health-topics/occupational-health" },
      { title: "Cornell University Ergonomics Program", url: "https://ergo.human.cornell.edu" },
    ],
  },
  {
    category: "Movimento e atividade física",
    items: [
      { title: "OMS — Atividade Física", url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity" },
    ],
  },
  {
    category: "Foco e produtividade",
    items: [
      { title: "Francesco Cirillo — Pomodoro Technique", url: "https://francescocirillo.com/products/the-pomodoro-technique" },
    ],
  },
  {
    category: "Saúde mental e bem-estar",
    items: [
      { title: "OMS — Saúde Mental", url: "https://www.who.int/health-topics/mental-health" },
      { title: "CVV — Centro de Valorização da Vida (188)", url: "https://www.cvv.org.br" },
    ],
  },
];

export default function FontesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1 flex items-center gap-2">
          <BookOpen className="text-green" /> Fontes e Referências
        </h1>
        <p className="text-text-secondary mb-6">Referências utilizadas como base para os conteúdos do Equilíbrio.</p>
      </motion.div>

      <div className="space-y-4">
        {SOURCES.map((group, i) => (
          <motion.div key={group.category} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }} className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-semibold text-text mb-3">{group.category}</h2>
            <div className="space-y-2">
              {group.items.map((item, j) => (
                <a
                  key={j}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue hover:underline"
                >
                  <ExternalLink size={14} className="flex-shrink-0" />
                  {item.title}
                </a>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
