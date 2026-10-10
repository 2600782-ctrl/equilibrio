"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Laptop, Monitor, Armchair, Keyboard, Mouse, User, Check, X, Info } from "lucide-react";
import { useAppStore } from "@/lib/store";

const ERGO_POINTS = [
  {
    id: "monitor",
    label: "Monitor",
    icon: Monitor,
    x: 50, y: 15,
    tip: "O topo do monitor deve estar na altura dos olhos ou levemente abaixo. Distância de aproximadamente um braço (40-70 cm). Evite reflexos na tela.",
    source: "Ministério do Trabalho — NR 17",
  },
  {
    id: "chair",
    label: "Cadeira",
    icon: Armchair,
    x: 50, y: 60,
    tip: "A cadeira deve oferecer suporte lombar adequado. Pés apoiados no chão ou em suporte. Cotovelos formando ângulo de ~90° ao digitar.",
    source: "WHO — Occupational Health",
  },
  {
    id: "desk",
    label: "Mesa",
    icon: Laptop,
    x: 50, y: 45,
    tip: "A mesa deve ter altura que permita cotovelos em ~90°. Espaço suficiente para pernas. Objetos frequentes ao alcance.",
    source: "NR 17 — Ergonomia",
  },
  {
    id: "keyboard",
    label: "Teclado",
    icon: Keyboard,
    x: 35, y: 50,
    tip: "Teclado na altura da mesa, punhos retos ao digitar. Se possível, use teclado ergonômico ou suporte de punho.",
    source: "Associação Americana de Ergonomia",
  },
  {
    id: "mouse",
    label: "Mouse",
    icon: Mouse,
    x: 65, y: 50,
    tip: "Mouse próximo ao teclado, no mesmo nível. Punho reto ao usar. Alternar mãos pode reduzir tensão.",
    source: "Cornell University Ergonomics",
  },
  {
    id: "posture",
    label: "Postura",
    icon: User,
    x: 50, y: 75,
    tip: "Costas apoiadas no encosto. Ombros relaxados. Cabeça alinhada com a coluna. Evite curvar-se para frente por longos períodos.",
    source: "OMS — Saúde Ocupacional",
  },
];

export default function ErgonomiaPage() {
  const [selectedPoint, setSelectedPoint] = useState<string | null>(null);
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeItems, setChallengeItems] = useState<{ id: string; label: string; placed: boolean }[]>([
    { id: "monitor", label: "Monitor", placed: false },
    { id: "chair", label: "Cadeira", placed: false },
    { id: "keyboard", label: "Teclado", placed: false },
    { id: "mouse", label: "Mouse", placed: false },
    { id: "posture", label: "Postura correta", placed: false },
  ]);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const ergonomicsCompleted = useAppStore((s) => s.ergonomicsCompleted);
  const setErgonomicsCompleted = useAppStore((s) => s.setErgonomicsCompleted);

  const selected = ERGO_POINTS.find(p => p.id === selectedPoint);

  const handlePlaceItem = (id: string) => {
    if (challengeComplete) return;
    const newItems = challengeItems.map(item => item.id === id ? { ...item, placed: true } : item);
    setChallengeItems(newItems);
    if (newItems.every(item => item.placed)) {
      setChallengeComplete(true);
      if (!ergonomicsCompleted) {
        setErgonomicsCompleted();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1 flex items-center gap-2">
          <Laptop className="text-blue" /> Ergonomia
        </h1>
        <p className="text-text-secondary mb-6">Explore sua estação de trabalho e aprenda sobre postura e organização.</p>
      </motion.div>

      {/* Interactive station */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-6 mb-6">
        <h2 className="font-semibold text-text mb-4">Estação de trabalho</h2>
        <p className="text-sm text-text-secondary mb-4">Clique nos pontos para ver dicas sobre cada elemento.</p>

        <div className="relative bg-beige/30 rounded-xl mx-auto" style={{ maxWidth: 500, aspectRatio: "5/4" }}>
          {/* Desk visualization */}
          <div className="absolute left-[10%] right-[10%] top-[40%] h-[3px] bg-border rounded" />
          <div className="absolute left-[15%] top-[42%] bottom-[20%] w-[3px] bg-border rounded" />
          <div className="absolute right-[15%] top-[42%] bottom-[20%] w-[3px] bg-border rounded" />

          {/* Interactive points */}
          {ERGO_POINTS.map((point) => (
            <motion.button
              key={point.id}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedPoint(selectedPoint === point.id ? null : point.id)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition shadow-md ${
                selectedPoint === point.id ? "bg-green-dark text-white ring-2 ring-green" : "bg-card text-green-dark hover:bg-green-light"
              }`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              title={point.label}
            >
              <point.icon size={18} />
            </motion.button>
          ))}
        </div>

        {/* Info panel */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 bg-green-light/30 rounded-xl p-4 overflow-hidden"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-dark text-white flex items-center justify-center flex-shrink-0">
                  <selected.icon size={16} />
                </div>
                <div>
                  <h3 className="font-semibold text-green-dark mb-1">{selected.label}</h3>
                  <p className="text-sm text-text mb-2">{selected.tip}</p>
                  <p className="text-xs text-text-secondary italic">Fonte: {selected.source}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Challenge */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border p-6">
        <h2 className="font-semibold text-text mb-2">Desafio: Organize sua estação</h2>
        <p className="text-sm text-text-secondary mb-4">Clique em cada item para posicioná-lo corretamente na estação de trabalho.</p>

        {ergonomicsCompleted && !showChallenge ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-green-light flex items-center justify-center mx-auto mb-2">
              <Check size={24} className="text-green-dark" />
            </div>
            <p className="font-medium text-green-dark">Desafio concluído!</p>
            <button onClick={() => setShowChallenge(true)} className="mt-2 text-sm text-text-secondary hover:text-text transition">Ver desafio</button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
              {challengeItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={!item.placed ? { scale: 1.03 } : {}}
                  whileTap={!item.placed ? { scale: 0.97 } : {}}
                  onClick={() => !item.placed && handlePlaceItem(item.id)}
                  className={`py-3 px-2 rounded-xl text-sm font-medium transition ${
                    item.placed
                      ? "bg-green-dark text-white"
                      : "bg-border-light text-text hover:bg-green-light hover:text-green-dark"
                  }`}
                >
                  {item.placed ? <Check size={14} className="inline mr-1" /> : null}
                  {item.label}
                </motion.button>
              ))}
            </div>
            {challengeComplete && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-2">
                <p className="font-medium text-green-dark mb-1">Desafio concluído! +40 XP</p>
              </motion.div>
            )}
            {!challengeComplete && (
              <button
                onClick={() => {
                  setChallengeItems(challengeItems.map(i => ({ ...i, placed: false })));
                  setChallengeComplete(false);
                }}
                className="text-sm text-text-secondary hover:text-text transition"
              >
                Reiniciar desafio
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
