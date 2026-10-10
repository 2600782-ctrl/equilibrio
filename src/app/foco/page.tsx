"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Play, Pause, RotateCcw, Check, Settings, Volume2, VolumeX, X } from "lucide-react";
import { useAppStore } from "@/lib/store";

type Phase = "focus" | "break" | "longBreak";

export default function FocoPage() {
  const addFocus = useAppStore((s) => s.addFocus);
  const addToast = useAppStore((s) => s.addToast);
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const setSoundEnabled = useAppStore((s) => s.setSoundEnabled);
  const pomodoroFocusMinutes = useAppStore((s) => s.pomodoroFocusMinutes);
  const pomodoroBreakMinutes = useAppStore((s) => s.pomodoroBreakMinutes);
  const pomodoroLongBreakMinutes = useAppStore((s) => s.pomodoroLongBreakMinutes);
  const focusRecords = useAppStore((s) => s.focusRecords);
  const [showSettings, setShowSettings] = useState(false);
  const [focusMin, setFocusMin] = useState(pomodoroFocusMinutes);
  const [breakMin, setBreakMin] = useState(pomodoroBreakMinutes);
  const [longBreakMin, setLongBreakMin] = useState(pomodoroLongBreakMinutes);

  const [phase, setPhase] = useState<Phase>("focus");
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(pomodoroFocusMinutes * 60);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phaseDuration = phase === "focus" ? pomodoroFocusMinutes * 60 : phase === "break" ? pomodoroBreakMinutes * 60 : pomodoroLongBreakMinutes * 60;
  const progress = 1 - secondsLeft / phaseDuration;

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setRunning(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const playSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.1;
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch { /* ignore */ }
  }, [soundEnabled]);

  // Watch for timer reaching 0
  useEffect(() => {
    if (secondsLeft === 0 && !running) {
      playSound();
      if (phase === "focus") {
        if (pomodoroFocusMinutes >= 15) {
          addFocus(pomodoroFocusMinutes);
        }
        const newCount = completedPomodoros + 1;
        setCompletedPomodoros(newCount);
        setShowComplete(true);
        if (newCount % 4 === 0) {
          setPhase("longBreak");
          setSecondsLeft(pomodoroLongBreakMinutes * 60);
        } else {
          setPhase("break");
          setSecondsLeft(pomodoroBreakMinutes * 60);
        }
      } else {
        setPhase("focus");
        setSecondsLeft(pomodoroFocusMinutes * 60);
      }
    }
  }, [secondsLeft, running, phase, pomodoroFocusMinutes, pomodoroBreakMinutes, pomodoroLongBreakMinutes, completedPomodoros, playSound, addFocus]);

  const handleStart = () => setRunning(true);
  const handlePause = () => setRunning(false);
  const handleReset = () => {
    setRunning(false);
    setSecondsLeft(phaseDuration);
  };
  const handleFinishEarly = () => {
    setRunning(false);
    if (pomodoroFocusMinutes >= 15) addFocus(pomodoroFocusMinutes);
    setPhase("break");
    setSecondsLeft(pomodoroBreakMinutes * 60);
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  const today = new Date().toISOString().slice(0, 10);
  const todaySessions = focusRecords.filter(r => r.timestamp.slice(0, 10) === today && r.completed);
  const weekSessions = focusRecords.filter(r => {
    const d = new Date(r.timestamp);
    const now = new Date();
    return r.completed && (now.getTime() - d.getTime()) < 7 * 86400000;
  });

  const phaseLabel = phase === "focus" ? "Foco" : phase === "break" ? "Pausa" : "Pausa longa";
  const phaseColor = phase === "focus" ? "#41604A" : "#78A7BB";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-green-dark flex items-center gap-2">
              <Target className="text-green-dark" /> Foco
            </h1>
            <p className="text-text-secondary text-sm">Técnica Pomodoro — períodos de concentração e pausas.</p>
          </div>
          <button onClick={() => setShowSettings(true)} className="p-2 rounded-lg hover:bg-border-light transition text-text-secondary">
            <Settings size={20} />
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl border border-border p-8 mb-6 flex flex-col items-center">
        <div className="mb-4 px-4 py-1.5 rounded-full text-sm font-medium" style={{ backgroundColor: phase === "focus" ? "#A8C5AB" : "#C7DDE5", color: phaseColor }}>
          {phaseLabel}
        </div>

        <div className="relative mb-6">
          <svg width={280} height={280} className="transform -rotate-90">
            <circle cx={140} cy={140} r={radius} fill="none" stroke="#DDE3DA" strokeWidth={8} />
            <motion.circle
              cx={140} cy={140} r={radius}
              fill="none"
              stroke={phaseColor}
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl font-bold text-text tabular-nums">{formatTime(secondsLeft)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!running ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleStart}
              className="px-8 py-3 rounded-xl bg-green-dark text-white font-medium hover:bg-green transition flex items-center gap-2"
            >
              <Play size={18} /> {secondsLeft < phaseDuration ? "Continuar" : "Iniciar"}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePause}
              className="px-8 py-3 rounded-xl bg-terracotta text-white font-medium hover:bg-terracotta-light transition flex items-center gap-2"
            >
              <Pause size={18} /> Pausar
            </motion.button>
          )}
          <button onClick={handleReset} className="p-3 rounded-xl border border-border text-text-secondary hover:bg-border-light transition" title="Reiniciar">
            <RotateCcw size={18} />
          </button>
          {phase === "focus" && running && (
            <button onClick={handleFinishEarly} className="p-3 rounded-xl border border-border text-text-secondary hover:bg-border-light transition" title="Finalizar">
              <Check size={18} />
            </button>
          )}
        </div>

        <p className="mt-4 text-sm text-text-secondary">Pomodoros concluídos: {completedPomodoros}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-xs text-text-secondary mb-1">Hoje</p>
          <p className="text-lg font-semibold text-text">{todaySessions.length} sessões</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-xs text-text-secondary mb-1">Semana</p>
          <p className="text-lg font-semibold text-text">{weekSessions.length} sessões</p>
        </div>
      </motion.div>

      {/* Complete modal */}
      <AnimatePresence>
        {showComplete && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/30" onClick={() => setShowComplete(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-card rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
                <div className="w-16 h-16 rounded-full bg-green-light flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-dark" />
                </div>
                <h3 className="text-xl font-bold text-green-dark mb-2">Período de foco concluído!</h3>
                <p className="text-green font-medium mb-1">+20 XP</p>
                <p className="text-text-secondary text-sm mb-6">Que tal fazer uma pequena pausa?</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => {
                      setShowComplete(false);
                      setPhase("break");
                      setSecondsLeft(pomodoroBreakMinutes * 60);
                    }}
                    className="py-2.5 rounded-xl bg-green-dark text-white font-medium hover:bg-green transition"
                  >
                    Iniciar pausa
                  </button>
                  <button onClick={() => setShowComplete(false)} className="py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-border-light transition">
                    Agora não
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Settings modal */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/30" onClick={() => setShowSettings(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-card rounded-2xl shadow-xl p-6 max-w-sm w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-text">Configurações</h3>
                  <button onClick={() => setShowSettings(false)} className="p-1 rounded-lg hover:bg-border-light"><X size={16} /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Foco (minutos)</label>
                    <input type="number" value={focusMin} onChange={(e) => setFocusMin(Number(e.target.value))} min={5} max={60} className="w-full px-3 py-2 rounded-xl border border-border text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Pausa (minutos)</label>
                    <input type="number" value={breakMin} onChange={(e) => setBreakMin(Number(e.target.value))} min={1} max={30} className="w-full px-3 py-2 rounded-xl border border-border text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Pausa longa (minutos)</label>
                    <input type="number" value={longBreakMin} onChange={(e) => setLongBreakMin(Number(e.target.value))} min={5} max={45} className="w-full px-3 py-2 rounded-xl border border-border text-sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-secondary">Som</span>
                    <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-2 rounded-lg hover:bg-border-light transition">
                      {soundEnabled ? <Volume2 size={18} className="text-green-dark" /> : <VolumeX size={18} className="text-text-secondary" />}
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      useAppStore.getState().setPomodoroFocusMinutes(focusMin);
                      useAppStore.getState().setPomodoroBreakMinutes(breakMin);
                      useAppStore.getState().setPomodoroLongBreakMinutes(longBreakMin);
                      if (!running) {
                        setSecondsLeft(phase === "focus" ? focusMin * 60 : phase === "break" ? breakMin * 60 : longBreakMin * 60);
                      }
                      setShowSettings(false);
                      addToast("Configurações salvas.", "success");
                    }}
                    className="w-full py-2.5 rounded-xl bg-green-dark text-white font-medium hover:bg-green transition"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
