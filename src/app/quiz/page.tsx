"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Check, X as XIcon, ArrowRight, RotateCcw, Trophy } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { QUIZ_QUESTIONS, type QuizQuestion } from "@/lib/data";

const CATEGORIES = ["Geral", "Sono", "Hidratação", "Ergonomia", "Foco", "Movimento"];
const DIFFICULTIES = [
  { id: "easy", label: "Fácil" },
  { id: "medium", label: "Médio" },
  { id: "hard", label: "Difícil" },
];

export default function QuizPage() {
  const [step, setStep] = useState<"setup" | "playing" | "feedback" | "result">("setup");
  const [category, setCategory] = useState("Sono");
  const [difficulty, setDifficulty] = useState("easy");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<{ selected: number; correct: boolean }[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const addQuiz = useAppStore((s) => s.addQuiz);

  const startQuiz = () => {
    const filtered = QUIZ_QUESTIONS.filter(
      (q) => (category === "Geral" || q.category === category) && q.difficulty === difficulty
    );
    const shuffled = filtered.sort(() => Math.random() - 0.5).slice(0, 10);
    if (shuffled.length === 0) {
      // Fallback: use any questions
      const fallback = QUIZ_QUESTIONS.filter(q => q.difficulty === difficulty).sort(() => Math.random() - 0.5).slice(0, 10);
      setQuestions(fallback.length > 0 ? fallback : QUIZ_QUESTIONS.slice(0, 10));
    } else {
      setQuestions(shuffled);
    }
    setCurrentQ(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setStep("playing");
  };

  const handleAnswer = (index: number) => {
    if (showFeedback) return;
    const q = questions[currentQ];
    const isCorrect = index === q.correctIndex;
    setSelectedAnswer(index);
    setShowFeedback(true);
    setAnswers([...answers, { selected: index, correct: isCorrect }]);
  };

  const nextQuestion = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      // Quiz complete
      const finalAnswers = [...answers];
      const score = finalAnswers.filter(a => a.correct).length;
      addQuiz({
        category,
        difficulty,
        score,
        total: questions.length,
        answers: finalAnswers.map((a, i) => ({ questionIndex: i, selectedAnswer: a.selected, correct: a.correct })),
      });
      setStep("result");
    }
  };

  const score = answers.filter(a => a.correct).length;
  const q = questions[currentQ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1 flex items-center gap-2">
          <Brain className="text-terracotta" /> Quiz
        </h1>
        <p className="text-text-secondary mb-6">Teste seus conhecimentos sobre saúde e bem-estar.</p>
      </motion.div>

      {/* Setup */}
      {step === "setup" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl border border-border p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-text mb-3">Categoria</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    category === cat ? "bg-green-dark text-white" : "bg-border-light text-text hover:bg-border"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-text mb-3">Dificuldade</h3>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                    difficulty === d.id ? "bg-green-dark text-white" : "bg-border-light text-text hover:bg-border"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={startQuiz} className="w-full py-3 rounded-xl bg-green-dark text-white font-medium hover:bg-green transition">
            Começar quiz
          </button>
        </motion.div>
      )}

      {/* Playing */}
      {step === "playing" && q && (
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-card rounded-xl border border-border p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-secondary">Pergunta {currentQ + 1} de {questions.length}</span>
              <span className="text-xs font-medium text-green-dark">{q.category}</span>
            </div>
            <div className="w-full h-2 bg-border-light rounded-full overflow-hidden">
              <div className="h-full bg-green-dark rounded-full transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
            </div>
          </div>

          <h2 className="text-lg font-semibold text-text mb-6">{q.question}</h2>

          <div className="space-y-2 mb-4">
            {q.options.map((option, i) => {
              let className = "w-full py-3 px-4 rounded-xl text-sm font-medium text-left transition ";
              if (showFeedback) {
                if (i === q.correctIndex) {
                  className += "bg-green-light text-green-dark border border-green";
                } else if (i === selectedAnswer && !answers[answers.length - 1]?.correct) {
                  className += "bg-terracotta/10 text-terracotta border border-terracotta";
                } else {
                  className += "bg-border-light/50 text-text-secondary";
                }
              } else {
                className += selectedAnswer === i
                  ? "bg-green-dark text-white"
                  : "bg-border-light text-text hover:bg-green-light hover:text-green-dark";
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={showFeedback}
                  className={className}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
              {answers[answers.length - 1]?.correct ? (
                <div className="flex items-start gap-2 text-green-dark">
                  <Check size={18} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Correto!</p>
                    <p className="text-sm text-text-secondary">{q.explanation}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-terracotta">
                  <XIcon size={18} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Não foi dessa vez.</p>
                    <p className="text-sm text-text-secondary">Resposta correta: {q.options[q.correctIndex]}. {q.explanation}</p>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {showFeedback && (
            <button onClick={nextQuestion} className="w-full py-3 rounded-xl bg-green-dark text-white font-medium hover:bg-green transition flex items-center justify-center gap-2">
              {currentQ < questions.length - 1 ? "Próxima" : "Ver resultado"} <ArrowRight size={16} />
            </button>
          )}
        </motion.div>
      )}

      {/* Result */}
      {step === "result" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-light flex items-center justify-center mx-auto mb-4">
            <Trophy size={32} className="text-green-dark" />
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">{score}/{questions.length}</h2>
          <p className="text-lg font-semibold text-green-dark mb-1">{Math.round((score / questions.length) * 100)}%</p>
          <p className="text-sm text-text-secondary mb-6">
            +{Math.round((score / questions.length) * 50)} XP
          </p>
          {score === questions.length && (
            <p className="text-sm font-medium text-terracotta mb-4">🎉 Perfeito! Conquista desbloqueada!</p>
          )}
          <div className="flex gap-2">
            <button onClick={() => { setStep("setup"); }} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-border-light transition flex items-center justify-center gap-1">
              <RotateCcw size={14} /> Refazer
            </button>
            <button onClick={() => setStep("setup")} className="flex-1 py-2.5 rounded-xl bg-green-dark text-white text-sm font-medium hover:bg-green transition">
              Outro quiz
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
