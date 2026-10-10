"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Wind, Play, Square } from "lucide-react";

type BreathPhase = "idle" | "inhale" | "hold" | "exhale";

export default function PausaGuiadaPage() {
  const [phase, setPhase] = useState<BreathPhase>("idle");
  const [seconds, setSeconds] = useState(0);
  const [cycles, setCycles] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const INHALE_TIME = 4;
  const HOLD_TIME = 4;
  const EXHALE_TIME = 6;

  useEffect(() => {
    if (phase === "idle") return;

    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1;
        if (phase === "inhale" && next >= INHALE_TIME) {
          setPhase("hold");
          return 0;
        }
        if (phase === "hold" && next >= HOLD_TIME) {
          setPhase("exhale");
          return 0;
        }
        if (phase === "exhale" && next >= EXHALE_TIME) {
          setCycles((c) => c + 1);
          setPhase("inhale");
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase]);

  const handleStart = () => {
    setPhase("inhale");
    setSeconds(0);
    setCycles(0);
  };

  const handleStop = () => {
    setPhase("idle");
    setSeconds(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const scaleValue =
    phase === "inhale" ? 1 + (seconds / INHALE_TIME) * 0.5
    : phase === "hold" ? 1.5
    : phase === "exhale" ? 1.5 - (seconds / EXHALE_TIME) * 0.5
    : 1;

  const phaseText = phase === "inhale" ? "Inspire" : phase === "hold" ? "Segure" : phase === "exhale" ? "Expire" : "";

  const totalDuration = phase === "inhale" ? INHALE_TIME : phase === "hold" ? HOLD_TIME : phase === "exhale" ? EXHALE_TIME : 1;
  const progress = totalDuration > 0 ? seconds / totalDuration : 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1 flex items-center gap-2">
          <Wind className="text-blue" /> Pausa Guiada
        </h1>
        <p className="text-text-secondary mb-2">Reserve um momento para diminuir o ritmo.</p>
        <p className="text-xs text-text-secondary italic mb-6">
          Este exercício de respiração é uma prática de relaxamento. Não substitui acompanhamento profissional.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border p-8 flex flex-col items-center">
        {/* Breathing circle */}
        <div className="relative mb-8">
          <motion.div
            animate={{ scale: scaleValue }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="w-40 h-40 rounded-full bg-green-light/40 flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: scaleValue * 0.85 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="w-32 h-32 rounded-full bg-green-light/60 flex items-center justify-center"
            >
              <motion.div
                animate={{ scale: scaleValue * 0.7 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="w-24 h-24 rounded-full bg-green-dark/20 flex items-center justify-center"
              >
                {phase !== "idle" && (
                  <motion.p
                    key={phase}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg font-semibold text-green-dark"
                  >
                    {phaseText}
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Progress bar */}
        {phase !== "idle" && (
          <div className="w-64 max-w-full mb-6">
            <div className="w-full h-2 bg-border-light rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${progress * 100}%` }}
                className="h-full bg-green-dark rounded-full"
              />
            </div>
          </div>
        )}

        {/* Cycles */}
        {phase !== "idle" && (
          <p className="text-sm text-text-secondary mb-4">Ciclos: {cycles}</p>
        )}

        {/* Controls */}
        {phase === "idle" ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="px-8 py-3 rounded-xl bg-green-dark text-white font-medium hover:bg-green transition flex items-center gap-2"
          >
            <Play size={18} /> Começar
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStop}
            className="px-8 py-3 rounded-xl bg-terracotta text-white font-medium hover:bg-terracotta-light transition flex items-center gap-2"
          >
            <Square size={18} /> Parar
          </motion.button>
        )}

        {phase === "idle" && cycles > 0 && (
          <p className="mt-4 text-sm text-green-dark font-medium">
            Sessão anterior: {cycles} ciclo(s) completado(s).
          </p>
        )}
      </motion.div>

      {/* Tips */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border p-5 mt-6">
        <h2 className="font-semibold text-text mb-3">Dicas</h2>
        <ul className="space-y-2 text-sm text-text-secondary">
          <li>• Sente-se confortavelmente e relaxe os ombros.</li>
          <li>• Inspire lentamente pelo nariz.</li>
          <li>• Segure o ar por alguns segundos.</li>
          <li>• Expire lentamente pela boca.</li>
          <li>• Repita por quantos ciclos desejar.</li>
        </ul>
      </motion.div>
    </div>
  );
}
