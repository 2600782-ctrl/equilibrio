"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardCheck, ArrowLeft, ArrowRight, Check, Trash2, X } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { CHECKIN_QUESTIONS, type CheckinQuestion } from "@/lib/data";
import type { CheckinResponse, CheckinResult } from "@/lib/store";

const CATEGORY_ROUTES: Record<string, { label: string; route: string }> = {
  "Sono": { label: "Aprender sobre sono", route: "/aprender" },
  "Foco": { label: "Abrir Pomodoro", route: "/foco" },
  "Pausas": { label: "Pausa guiada", route: "/pausa-guiada" },
  "Ergonomia": { label: "Ver ergonomia", route: "/ergonomia" },
  "Movimento": { label: "Ver movimento", route: "/movimento" },
  "Hidratação": { label: "Abrir hidratação", route: "/hidratacao" },
};

function processCheckinResult(responses: CheckinResponse[], questions: CheckinQuestion[]): CheckinResult {
  const categories: Record<string, number[]> = {};

  responses.forEach((resp, i) => {
    const cat = questions[i]?.category || "Outro";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(resp.value);
  });

  const categoryAvg: Record<string, number> = {};
  Object.entries(categories).forEach(([cat, vals]) => {
    categoryAvg[cat] = vals.reduce((a, b) => a + b, 0) / vals.length;
  });

  const positives: string[] = [];
  const intermediates: string[] = [];
  const attention: string[] = [];

  Object.entries(categoryAvg).forEach(([cat, avg]) => {
    if (avg >= 4) positives.push(cat);
    else if (avg >= 3) intermediates.push(cat);
    else attention.push(cat);
  });

  return { categories: categoryAvg, positives, intermediates, attention };
}

function generateResultText(result: CheckinResult, name: string): { main: string; detail: string } {
  if (result.attention.length === 0 && result.intermediates.length === 0) {
    return {
      main: `Seu check-in indica que vários aspectos da sua rotina foram percebidos positivamente nos últimos dias.`,
      detail: result.positives.length > 0
        ? `Você relatou resultados especialmente positivos em ${result.positives.join(", ").toLowerCase()}.`
        : "",
    };
  }

  if (result.attention.length > 0 && result.positives.length > 0) {
    const positiveList = result.positives.join(", ").toLowerCase();
    const attentionList = result.attention.join(", ").toLowerCase();
    return {
      main: `Alguns aspectos da sua rotina podem merecer um pouco mais de atenção.`,
      detail: `Você avaliou ${positiveList} de maneira positiva, enquanto ${attentionList} apareceram como aspectos mais difíceis.`,
    };
  }

  if (result.attention.length >= 3) {
    return {
      main: `Suas respostas mostram que vários aspectos do seu bem-estar têm sido mais difíceis nos últimos dias.`,
      detail: `Caso essas dificuldades sejam persistentes, intensas ou interfiram significativamente no cotidiano, considerar buscar apoio adequado pode ser importante.`,
    };
  }

  return {
    main: `Seu check-in mostra uma mistura de aspectos positivos e áreas que podem merecer atenção.`,
    detail: result.attention.length > 0 ? `Áreas que aparecem como mais difíceis: ${result.attention.join(", ").toLowerCase()}.` : "",
  };
}

export default function CheckinPage() {
  const [step, setStep] = useState<"intro" | "questions" | "result" | "history">("intro");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<CheckinResponse[]>([]);
  const [result, setResult] = useState<CheckinResult | null>(null);
  const [resultText, setResultText] = useState<{ main: string; detail: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const user = useAppStore((s) => s.user);
  const addCheckin = useAppStore((s) => s.addCheckin);
  const deleteCheckin = useAppStore((s) => s.deleteCheckin);
  const checkinRecords = useAppStore((s) => s.checkinRecords);

  const name = user?.name || "você";
  const questions = CHECKIN_QUESTIONS;

  const handleAnswer = (questionId: string, answer: string, value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQ] = { questionId, answer, value };
    setAnswers(newAnswers);

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      // Process result
      const checkinResult = processCheckinResult(newAnswers, questions);
      setResult(checkinResult);
      setResultText(generateResultText(checkinResult, name));
      addCheckin(newAnswers, checkinResult);
      setStep("result");
    }
  };

  const handlePrevious = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const startCheckin = () => {
    setStep("questions");
    setCurrentQ(0);
    setAnswers([]);
    setResult(null);
    setResultText(null);
  };

  const q = questions[currentQ];
  const prevAnswer = answers[currentQ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1 flex items-center gap-2">
          <ClipboardCheck className="text-blue" /> Check-in
        </h1>
        <p className="text-text-secondary mb-6">Refleta sobre alguns aspectos da sua rotina e bem-estar.</p>
      </motion.div>

      {/* Intro */}
      {step === "intro" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-text mb-3">
              Este check-in permite refletir sobre alguns aspectos da sua rotina e bem-estar.
            </p>
            <p className="text-xs text-text-secondary italic mb-4">
              Ele não é uma avaliação médica ou psicológica e não realiza diagnósticos. Pense nos últimos 7 dias ao responder.
            </p>
            <button onClick={startCheckin} className="w-full py-3 rounded-xl bg-green-dark text-white font-medium hover:bg-green transition">
              Começar check-in
            </button>
          </div>

          {/* History link */}
          {checkinRecords.length > 0 && (
            <button onClick={() => setStep("history")} className="w-full text-center py-2 text-sm text-green-dark hover:text-green transition">
              Ver histórico de check-ins
            </button>
          )}
        </motion.div>
      )}

      {/* Questions */}
      {step === "questions" && q && (
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-xl border border-border p-6">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-secondary">Pergunta {currentQ + 1} de {questions.length}</span>
              <span className="text-xs font-medium text-green-dark">{q.category}</span>
            </div>
            <div className="w-full h-2 bg-border-light rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                className="h-full bg-green-dark rounded-full"
              />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-text mb-6">{q.question}</h2>

          <div className="space-y-2 mb-6">
            {q.options.map((option, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleAnswer(q.id, option, q.values[i])}
                className={`w-full py-3 px-4 rounded-xl text-sm font-medium text-left transition ${
                  prevAnswer?.answer === option
                    ? "bg-green-dark text-white"
                    : "bg-border-light text-text hover:bg-green-light hover:text-green-dark"
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>

          {currentQ > 0 && (
            <button onClick={handlePrevious} className="flex items-center gap-1 text-sm text-text-secondary hover:text-text transition">
              <ArrowLeft size={14} /> Voltar
            </button>
          )}
        </motion.div>
      )}

      {/* Result */}
      {step === "result" && result && resultText && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-green-light flex items-center justify-center mx-auto mb-3">
                <Check size={28} className="text-green-dark" />
              </div>
              <h2 className="text-xl font-bold text-green-dark mb-2">Check-in concluído</h2>
            </div>

            <p className="text-sm text-text mb-3">{resultText.main}</p>
            {resultText.detail && <p className="text-sm text-text-secondary mb-4">{resultText.detail}</p>}

            {/* Categories breakdown */}
            <div className="mt-6 space-y-2">
              {result.positives.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-green-dark uppercase tracking-wider mb-1">Pontos positivos</p>
                  <div className="flex flex-wrap gap-2">
                    {result.positives.map((cat) => (
                      <span key={cat} className="px-3 py-1 rounded-lg bg-green-light text-green-dark text-sm">✓ {cat}</span>
                    ))}
                  </div>
                </div>
              )}
              {result.intermediates.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-blue-dark uppercase tracking-wider mb-1">Intermediários</p>
                  <div className="flex flex-wrap gap-2">
                    {result.intermediates.map((cat) => (
                      <span key={cat} className="px-3 py-1 rounded-lg bg-blue-light text-blue-dark text-sm">○ {cat}</span>
                    ))}
                  </div>
                </div>
              )}
              {result.attention.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-terracotta uppercase tracking-wider mb-1">Áreas para observar</p>
                  <div className="flex flex-wrap gap-2">
                    {result.attention.map((cat) => (
                      <span key={cat} className="px-3 py-1 rounded-lg bg-beige text-terracotta text-sm">○ {cat}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action buttons */}
            {result.attention.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {result.attention.map((cat) => {
                  const route = CATEGORY_ROUTES[cat];
                  if (!route) return null;
                  return (
                    <Link key={cat} href={route.route} className="px-4 py-2 rounded-xl border border-border text-sm font-medium text-text hover:bg-border-light transition">
                      {route.label}
                    </Link>
                  );
                })}
              </div>
            )}

            <p className="text-xs text-text-secondary italic mt-6">
              Continue observando sua rotina e mantendo aquilo que vem funcionando para você.
            </p>
          </div>

          <div className="flex gap-2">
            <button onClick={() => { setStep("intro"); }} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-border-light transition">
              Fechar
            </button>
            <button onClick={() => setStep("history")} className="flex-1 py-2.5 rounded-xl bg-green-dark text-white text-sm font-medium hover:bg-green transition">
              Ver histórico
            </button>
          </div>
        </motion.div>
      )}

      {/* History */}
      {step === "history" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="font-semibold text-text mb-4">Histórico de check-ins</h2>
            {checkinRecords.length === 0 ? (
              <p className="text-text-secondary text-sm text-center py-4">Nenhum check-in registrado.</p>
            ) : (
              <div className="space-y-3">
                {checkinRecords.slice().reverse().map((record) => (
                  <div key={record.id} className="border-b border-border-light last:border-0 pb-3 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-text">
                        {new Date(record.timestamp).toLocaleDateString("pt-BR")}
                      </span>
                      {confirmDelete === record.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => { deleteCheckin(record.id); setConfirmDelete(null); }} className="text-xs text-terracotta hover:underline">Confirmar</button>
                          <button onClick={() => setConfirmDelete(null)} className="text-xs text-text-secondary hover:underline">Cancelar</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(record.id)} className="p-1 rounded text-text-secondary hover:text-terracotta">
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {record.result.positives.map((c) => (
                        <span key={c} className="text-xs px-2 py-0.5 rounded bg-green-light text-green-dark">✓ {c}</span>
                      ))}
                      {record.result.attention.map((c) => (
                        <span key={c} className="text-xs px-2 py-0.5 rounded bg-beige text-terracotta">○ {c}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setStep("intro")} className="text-sm text-green-dark hover:text-green transition">Voltar</button>
        </motion.div>
      )}
    </div>
  );
}
