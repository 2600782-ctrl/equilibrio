"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Plus, Edit3, Trash2, X, Clock } from "lucide-react";
import { useAppStore } from "@/lib/store";

function calcDuration(sleep: string, wake: string): number {
  const [sh, sm] = sleep.split(":").map(Number);
  const [wh, wm] = wake.split(":").map(Number);
  let sleepMin = sh * 60 + sm;
  let wakeMin = wh * 60 + wm;
  if (wakeMin <= sleepMin) wakeMin += 1440;
  return wakeMin - sleepMin;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h${m}min` : `${h}h`;
}

export default function SonoPage() {
  const records = useAppStore((s) => s.sleepRecords);
  const addSleep = useAppStore((s) => s.addSleep);
  const deleteSleep = useAppStore((s) => s.deleteSleep);
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [sleepTime, setSleepTime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");

  const handleAdd = () => {
    if (!sleepTime || !wakeTime) return;
    const duration = calcDuration(sleepTime, wakeTime);
    addSleep({ date, sleepTime, wakeTime, durationMinutes: duration });
    setShowForm(false);
    setSleepTime("23:00");
    setWakeTime("07:00");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1 flex items-center gap-2">
          <Moon className="text-terracotta" /> Sono
        </h1>
        <p className="text-text-secondary mb-6">Registre seus horários de sono e acompanhe seu descanso.</p>
      </motion.div>

      {/* Add form */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-5 mb-6">
        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="w-full py-3 rounded-xl bg-green-dark text-white font-medium hover:bg-green transition flex items-center justify-center gap-2">
            <Plus size={16} /> Registrar sono
          </button>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold text-text">Novo registro</h3>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Data</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Horário que dormiu</label>
                <input type="time" value={sleepTime} onChange={(e) => setSleepTime(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Horário que acordou</label>
                <input type="time" value={wakeTime} onChange={(e) => setWakeTime(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm" />
              </div>
            </div>
            {sleepTime && wakeTime && (
              <p className="text-sm text-green-dark font-medium">
                Duração: {formatDuration(calcDuration(sleepTime, wakeTime))}
              </p>
            )}
            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-border-light transition">Cancelar</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl bg-green-dark text-white text-sm font-medium hover:bg-green transition">Salvar</button>
            </div>
          </div>
        )}
      </motion.div>

      {/* History */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold text-text mb-4">Histórico</h2>
        {records.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-text-secondary text-sm mb-2">Nenhum registro ainda.</p>
            <button onClick={() => setShowForm(true)} className="text-sm font-medium text-green-dark hover:text-green transition">Fazer primeiro registro</button>
          </div>
        ) : (
          <div className="space-y-2">
            {records.slice().reverse().map((r) => (
              <div key={r.id} className="flex items-center justify-between py-3 border-b border-border-light last:border-0">
                <div className="flex items-center gap-3">
                  <Moon size={14} className="text-terracotta" />
                  <div>
                    <p className="text-sm font-medium text-text">{formatDuration(r.durationMinutes)}</p>
                    <p className="text-xs text-text-secondary">
                      {r.sleepTime} → {r.wakeTime} · {new Date(r.date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <button onClick={() => deleteSleep(r.id)} className="p-1.5 rounded-lg text-text-secondary hover:text-terracotta hover:bg-border-light transition">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Disclaimer */}
      <p className="text-xs text-text-secondary text-center mt-6 italic">
        Estes registros não constituem avaliação médica do sono. Dificuldades persistentes merecem acompanhamento profissional.
      </p>
    </div>
  );
}
