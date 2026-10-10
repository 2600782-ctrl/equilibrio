"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Volume2, Bell, Target, Save } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function ConfiguracoesPage() {
  const soundEnabled = useAppStore((s) => s.soundEnabled);
  const setSoundEnabled = useAppStore((s) => s.setSoundEnabled);
  const pomodoroFocusMinutes = useAppStore((s) => s.pomodoroFocusMinutes);
  const pomodoroBreakMinutes = useAppStore((s) => s.pomodoroBreakMinutes);
  const pomodoroLongBreakMinutes = useAppStore((s) => s.pomodoroLongBreakMinutes);
  const setPomodoroFocusMinutes = useAppStore((s) => s.setPomodoroFocusMinutes);
  const setPomodoroBreakMinutes = useAppStore((s) => s.setPomodoroBreakMinutes);
  const setPomodoroLongBreakMinutes = useAppStore((s) => s.setPomodoroLongBreakMinutes);
  const addToast = useAppStore((s) => s.addToast);

  const [focus, setFocus] = useState(pomodoroFocusMinutes);
  const [brk, setBrk] = useState(pomodoroBreakMinutes);
  const [longBrk, setLongBrk] = useState(pomodoroLongBreakMinutes);

  const handleSave = () => {
    setPomodoroFocusMinutes(focus);
    setPomodoroBreakMinutes(brk);
    setPomodoroLongBreakMinutes(longBrk);
    addToast("Configurações salvas.", "success");
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1 flex items-center gap-2">
          <Settings className="text-green" /> Configurações
        </h1>
        <p className="text-text-secondary mb-6">Ajuste as preferências da plataforma.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-4">
        {/* Sound */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 size={18} className="text-green-dark" />
              <div>
                <p className="font-medium text-text text-sm">Som</p>
                <p className="text-xs text-text-secondary">Tocar som ao concluir Pomodoro</p>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-11 h-6 rounded-full transition relative ${soundEnabled ? "bg-green-dark" : "bg-border"}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-transform ${soundEnabled ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>

        {/* Pomodoro settings */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} className="text-green-dark" />
            <h2 className="font-semibold text-text">Pomodoro</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Foco (minutos)</label>
              <input type="number" value={focus} onChange={(e) => setFocus(Number(e.target.value))} min={5} max={60} className="w-full px-3 py-2 rounded-xl border border-border text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Pausa (minutos)</label>
              <input type="number" value={brk} onChange={(e) => setBrk(Number(e.target.value))} min={1} max={30} className="w-full px-3 py-2 rounded-xl border border-border text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Pausa longa (minutos)</label>
              <input type="number" value={longBrk} onChange={(e) => setLongBrk(Number(e.target.value))} min={5} max={45} className="w-full px-3 py-2 rounded-xl border border-border text-sm" />
            </div>
          </div>
          <button onClick={handleSave} className="mt-4 w-full py-2.5 rounded-xl bg-green-dark text-white text-sm font-medium hover:bg-green transition flex items-center justify-center gap-2">
            <Save size={14} /> Salvar
          </button>
        </div>
      </motion.div>
    </div>
  );
}
