"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Target, Brain, ClipboardCheck, BookOpen, Trophy } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface PlantDef {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgLight: string;
  description: string;
  growthSource: string;
  getGrowth: () => number;
  milestones: number[];
  stages: string[];
}

function getStage(milestones: number[], growth: number): number {
  for (let i = milestones.length - 1; i >= 0; i--) {
    if (growth >= milestones[i]) return i + 1;
  }
  return 0;
}

function getProgress(milestones: number[], growth: number): number {
  const stage = getStage(milestones, growth);
  if (stage === 0) return growth > 0 ? growth / milestones[0] : 0;
  if (stage >= milestones.length) return 1;
  const prev = milestones[stage - 1];
  const next = milestones[stage];
  return (growth - prev) / (next - prev);
}

// Plant visual component
function PlantVisual({ stage, color, bgLight }: { stage: number; color: string; bgLight: string }) {
  const stageEmojis = ["🪹", "🌱", "🌿", "🪴", "🌸", "🌳"];
  const emoji = stageEmojis[Math.min(stage, 5)];
  const scale = 1 + stage * 0.15;

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="relative"
    >
      <div
        className="flex items-center justify-center rounded-2xl"
        style={{
          width: 60 + stage * 10,
          height: 60 + stage * 15,
          background: stage > 0 ? `linear-gradient(to top, ${bgLight}40, ${bgLight}10)` : "transparent",
        }}
      >
        <span className="text-center" style={{ fontSize: 28 + stage * 6 }}>{emoji}</span>
      </div>

      {/* Glow effect for higher stages */}
      {stage >= 4 && (
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute inset-0 rounded-2xl"
          style={{ background: `radial-gradient(circle, ${color}30, transparent)` }}
        />
      )}

      {/* Sparkle for max stage */}
      {stage >= 5 && (
        <motion.div
          animate={{ opacity: [0, 1, 0], rotate: [0, 180, 360] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-2 -right-2 text-sm"
        >
          ✨
        </motion.div>
      )}
    </motion.div>
  );
}

// Pot/ground component
function PotBase({ stage }: { stage: number }) {
  return (
    <div className="flex flex-col items-center mt-1">
      {/* Soil line */}
      <div className={`w-16 h-2 rounded-full ${stage > 0 ? "bg-green-dark/20" : "bg-border"}`} />
      {/* Pot */}
      <div className={`w-14 h-3 rounded-b-lg ${stage > 0 ? "bg-terracotta/40" : "bg-border-light"}`} />
    </div>
  );
}

export default function JardimPage() {
  const user = useAppStore((s) => s.user);
  const focusRecords = useAppStore((s) => s.focusRecords);
  const quizRecords = useAppStore((s) => s.quizRecords);
  const checkinRecords = useAppStore((s) => s.checkinRecords);
  const achievements = useAppStore((s) => s.achievements);
  const contentExplored = useAppStore((s) => s.contentExplored);
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  const name = user?.name || "Visitante";

  const plants: PlantDef[] = [
    {
      id: "focus",
      name: "Planta do Foco",
      icon: "🌿",
      color: "#41604A",
      bgLight: "#A8C5AB",
      description: "Cresce a cada Pomodoro concluído",
      growthSource: "Pomodoros",
      getGrowth: () => focusRecords.filter(r => r.completed).length,
      milestones: [1, 3, 6, 10, 15],
      stages: ["Semente", "Broto", "Crescendo", "Florescendo", "Plena"],
    },
    {
      id: "knowledge",
      name: "Flor do Saber",
      icon: "🌸",
      color: "#C98568",
      bgLight: "#D9A48C",
      description: "Cresce a cada quiz completado",
      growthSource: "Quizzes",
      getGrowth: () => quizRecords.length,
      milestones: [1, 3, 5, 8, 12],
      stages: ["Semente", "Broto", "Crescendo", "Florescendo", "Plena"],
    },
    {
      id: "wellbeing",
      name: "Girassol do Bem-Estar",
      icon: "🌻",
      color: "#78A7BB",
      bgLight: "#C7DDE5",
      description: "Cresce a cada check-in realizado",
      growthSource: "Check-ins",
      getGrowth: () => checkinRecords.length,
      milestones: [1, 3, 5, 8, 12],
      stages: ["Semente", "Broto", "Crescendo", "Florescendo", "Plena"],
    },
    {
      id: "curiosity",
      name: "Erva da Curiosidade",
      icon: "🪴",
      color: "#789F80",
      bgLight: "#A8C5AB",
      description: "Cresce ao explorar conteúdos educativos",
      growthSource: "Conteúdos explorados",
      getGrowth: () => contentExplored,
      milestones: [1, 3, 6, 10, 15],
      stages: ["Semente", "Broto", "Crescendo", "Florescendo", "Plena"],
    },
    {
      id: "mastery",
      name: "Árvore do Equilíbrio",
      icon: "🌳",
      color: "#41604A",
      bgLight: "#E8DDC8",
      description: "Cresce com suas conquistas desbloqueadas",
      growthSource: "Conquistas",
      getGrowth: () => achievements.length,
      milestones: [1, 3, 5, 7, 10],
      stages: ["Semente", "Broto", "Crescendo", "Florescendo", "Plena"],
    },
  ];

  const totalGrowth = plants.reduce((sum, p) => sum + getStage(p.milestones, p.getGrowth()), 0);
  const maxGrowth = plants.length * 5;
  const gardenPercent = Math.round((totalGrowth / maxGrowth) * 100);

  // Sparkle animation
  useEffect(() => {
    if (totalGrowth === 0) return;
    const interval = setInterval(() => {
      const id = Date.now();
      const x = 10 + Math.random() * 80;
      const y = 5 + Math.random() * 40;
      setSparkles(prev => [...prev.slice(-6), { id, x, y }]);
    }, 2500);
    return () => clearInterval(interval);
  }, [totalGrowth]);

  const selected = plants.find(p => p.id === selectedPlant);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1">🌱 Jardim Virtual</h1>
        <p className="text-text-secondary mb-6">
          Seu jardim cresce conforme você usa o Equilíbrio. Cuide das suas plantas cuidando de você!
        </p>
      </motion.div>

      {/* Garden overview */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-semibold text-text">Jardim de {name}</h2>
            <p className="text-sm text-text-secondary">
              Saúde do jardim: <span className="font-medium text-green-dark">{gardenPercent}%</span>
            </p>
          </div>
          <div className="text-3xl">
            {gardenPercent === 0 ? "🏜️" : gardenPercent < 25 ? "🌱" : gardenPercent < 50 ? "🌿" : gardenPercent < 75 ? "🌸" : gardenPercent < 100 ? "🌻" : "🌳"}
          </div>
        </div>
        <div className="w-full h-3 bg-border-light rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${gardenPercent}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-green-dark rounded-full"
          />
        </div>
        <p className="text-xs text-text-secondary mt-2">
          {totalGrowth} de {maxGrowth} pontos de crescimento
        </p>
      </motion.div>

      {/* Garden scene */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="relative rounded-2xl overflow-hidden mb-6 border border-border" style={{ minHeight: 340 }}>
        {/* Sky gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-light/30 via-background/80 to-green-light/20" />

        {/* Animated clouds */}
        <motion.div
          animate={{ x: [0, 40, 0] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="absolute top-6 left-8 text-4xl opacity-25 select-none"
        >
          ☁️
        </motion.div>
        <motion.div
          animate={{ x: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
          className="absolute top-14 right-12 text-3xl opacity-20 select-none"
        >
          ☁️
        </motion.div>

        {/* Sun */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
          className="absolute top-4 right-6"
        >
          <Sun size={28} className="text-terracotta opacity-30" />
        </motion.div>

        {/* Sparkles */}
        <AnimatePresence>
          {sparkles.map(s => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1, 0.5] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              className="absolute text-xs pointer-events-none select-none"
              style={{ left: `${s.x}%`, top: `${s.y}%` }}
            >
              ✨
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Ground */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-dark/15 to-transparent" />

        {/* Plants row */}
        <div className="relative z-10 flex justify-center items-end gap-2 sm:gap-4 md:gap-6 px-4 pt-24 pb-10" style={{ minHeight: 320 }}>
          {plants.map((plant, i) => {
            const growth = plant.getGrowth();
            const stage = getStage(plant.milestones, growth);

            return (
              <motion.button
                key={plant.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                onClick={() => setSelectedPlant(selectedPlant === plant.id ? null : plant.id)}
                className={`flex flex-col items-center p-2 rounded-xl transition ${
                  selectedPlant === plant.id ? "bg-white/60 ring-2 ring-green" : "hover:bg-white/30"
                }`}
              >
                {/* Plant name */}
                <p className="text-xs font-medium text-text-secondary mb-2 text-center leading-tight" style={{ maxWidth: 80 }}>
                  {plant.name.replace("Planta do ", "").replace("Flor do ", "").replace("Girassol do ", "").replace("Erva da ", "").replace("Árvore do ", "")}
                </p>

                {/* Plant visual */}
                <PlantVisual stage={stage} color={plant.color} bgLight={plant.bgLight} />

                {/* Pot */}
                <PotBase stage={stage} />

                {/* Stage dots */}
                <div className="flex gap-0.5 mt-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <div
                      key={s}
                      className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                        s <= stage ? "bg-green-dark" : "bg-border"
                      }`}
                    />
                  ))}
                </div>

                {/* Stage label */}
                <p className="text-[10px] text-text-secondary mt-0.5">
                  {stage === 0 ? "Vazio" : plant.stages[stage - 1]}
                </p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Selected plant details */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card rounded-xl border border-border p-5 mb-6 overflow-hidden"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{selected.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-text mb-1">{selected.name}</h3>
                <p className="text-sm text-text-secondary mb-2">{selected.description}</p>
                <p className="text-xs text-text-secondary mb-1">
                  Fonte de crescimento: <strong className="text-text">{selected.growthSource}</strong> — {selected.getGrowth()} registrado(s)
                </p>
                {(() => {
                  const stage = getStage(selected.milestones, selected.getGrowth());
                  const nextMilestone = stage < selected.milestones.length ? selected.milestones[stage] : null;
                  if (nextMilestone !== null) {
                    return (
                      <p className="text-xs text-green-dark font-medium">
                        Próximo estágio em: {nextMilestone - selected.getGrowth()} {selected.growthSource.toLowerCase()} mais
                      </p>
                    );
                  }
                  return <p className="text-xs text-green-dark font-medium">🌟 Estágio máximo atingido!</p>;
                })()}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How it works */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border p-5 mb-6">
        <h2 className="font-semibold text-text mb-4">Como funciona</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: <Target size={16} className="text-green-dark" />, label: "Pomodoros concluídos", grows: "Planta do Foco 🌿" },
            { icon: <Brain size={16} className="text-terracotta" />, label: "Quizzes completados", grows: "Flor do Saber 🌸" },
            { icon: <ClipboardCheck size={16} className="text-blue" />, label: "Check-ins realizados", grows: "Girassol do Bem-Estar 🌻" },
            { icon: <BookOpen size={16} className="text-green" />, label: "Conteúdos explorados", grows: "Erva da Curiosidade 🪴" },
            { icon: <Trophy size={16} className="text-terracotta" />, label: "Conquistas desbloqueadas", grows: "Árvore do Equilíbrio 🌳" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-border-light/50">
              <div className="flex-shrink-0">{item.icon}</div>
              <div>
                <p className="text-sm font-medium text-text">{item.label}</p>
                <p className="text-xs text-text-secondary">→ {item.grows}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Growth stages */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold text-text mb-3">Estágios de crescimento</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { emoji: "🪹", label: "Vazio", desc: "Nenhuma atividade" },
            { emoji: "🌱", label: "Semente", desc: "Primeiros passos" },
            { emoji: "🌿", label: "Broto", desc: "Começando a crescer" },
            { emoji: "🪴", label: "Crescendo", desc: "Ficando forte" },
            { emoji: "🌸", label: "Florescendo", desc: "Quase plena" },
            { emoji: "🌳", label: "Plena", desc: "Estágio máximo ✨" },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-border-light/50">
              <span className="text-lg">{s.emoji}</span>
              <div>
                <p className="text-sm font-medium text-text">{s.label}</p>
                <p className="text-xs text-text-secondary">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
