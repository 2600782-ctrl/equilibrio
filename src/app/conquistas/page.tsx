"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Star, Lock } from "lucide-react";
import { useAppStore, getLevelFromXp, ACHIEVEMENTS_DEF } from "@/lib/store";

const CATEGORIES = [
  { id: "geral", label: "Geral" },
  { id: "conhecimento", label: "Conhecimento" },
  { id: "foco", label: "Foco" },
  { id: "exploração", label: "Exploração" },
  { id: "secreta", label: "Secretas" },
];

export default function ConquistasPage() {
  const achievements = useAppStore((s) => s.achievements);
  const xp = useAppStore((s) => s.xp);
  const { level, currentXp, nextLevelXp } = getLevelFromXp(xp);

  const hasAchievement = (id: string) => achievements.some((a) => a.id === id);
  const getAchievement = (id: string) => achievements.find((a) => a.id === id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1 flex items-center gap-2">
          <Trophy className="text-terracotta" /> Conquistas
        </h1>
        <p className="text-text-secondary mb-6">Seu progresso na plataforma.</p>
      </motion.div>

      {/* Level/XP */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Star size={20} className="text-terracotta" />
            <span className="font-semibold text-text">Nível {level}</span>
          </div>
          <span className="text-sm text-text-secondary">{xp} XP total</span>
        </div>
        <div className="w-full h-3 bg-border-light rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentXp / nextLevelXp) * 100}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-green-dark rounded-full"
          />
        </div>
        <p className="text-xs text-text-secondary mt-1">{currentXp} / {nextLevelXp} XP para o próximo nível</p>
      </motion.div>

      {/* Achievement categories */}
      {CATEGORIES.map((cat) => {
        const defs = ACHIEVEMENTS_DEF.filter((a) => a.category === cat.id);
        if (defs.length === 0) return null;

        return (
          <motion.div key={cat.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="mb-6">
            <h2 className="font-semibold text-text mb-3">{cat.label}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {defs.map((def) => {
                const unlocked = hasAchievement(def.id);
                const ach = getAchievement(def.id);

                return (
                  <motion.div
                    key={def.id}
                    whileHover={{ scale: 1.02 }}
                    className={`rounded-xl border p-4 transition ${
                      unlocked
                        ? "bg-card border-green hover:shadow-sm"
                        : "bg-card border-border opacity-60"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                        unlocked ? "bg-green-light" : "bg-border-light"
                      }`}>
                        {unlocked ? def.icon : <Lock size={16} className="text-text-secondary" />}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold text-sm ${unlocked ? "text-text" : "text-text-secondary"}`}>
                          {def.secret && !unlocked ? "???" : def.title}
                        </h3>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {def.secret && !unlocked ? "Conquista secreta" : def.description}
                        </p>
                        {unlocked && (
                          <p className="text-xs text-green-dark font-medium mt-1">+{def.xp} XP</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}

      {/* Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold text-text mb-3">Estatísticas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MiniStat label="Conquistas" value={`${achievements.length}/${ACHIEVEMENTS_DEF.length}`} />
          <MiniStat label="Nível" value={`${level}`} />
          <MiniStat label="XP total" value={`${xp}`} />
          <MiniStat label="Progresso" value={`${Math.round((achievements.length / ACHIEVEMENTS_DEF.length) * 100)}%`} />
        </div>
      </motion.div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-2 rounded-lg bg-border-light">
      <p className="text-lg font-semibold text-text">{value}</p>
      <p className="text-xs text-text-secondary">{label}</p>
    </div>
  );
}
