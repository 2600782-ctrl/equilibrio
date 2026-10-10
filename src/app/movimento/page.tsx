"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Plus, Trash2, Clock } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { MOVEMENT_TYPES } from "@/lib/data";

export default function MovimentoPage() {
  const records = useAppStore((s) => s.movementRecords);
  const addMovement = useAppStore((s) => s.addMovement);
  const deleteMovement = useAppStore((s) => s.deleteMovement);
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState("walking");
  const [duration, setDuration] = useState("30");

  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = records.filter(r => r.timestamp.slice(0, 10) === today);
  const todayTotal = todayRecords.reduce((s, r) => s + r.durationMinutes, 0);

  const handleAdd = () => {
    const dur = parseInt(duration);
    if (dur > 0 && dur <= 600) {
      addMovement({ type, durationMinutes: dur, date: today });
      setShowForm(false);
      setDuration("30");
    }
  };

  const typeLabel = (id: string) => MOVEMENT_TYPES.find(t => t.id === id)?.label || id;
  const typeIcon = (id: string) => MOVEMENT_TYPES.find(t => t.id === id)?.icon || "💪";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1 flex items-center gap-2">
          <Activity className="text-green" /> Movimento
        </h1>
        <p className="text-text-secondary mb-6">Registre suas atividades físicas.</p>
      </motion.div>

      {/* Today summary */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-5 mb-6">
        <p className="text-sm text-text-secondary mb-1">Hoje</p>
        <p className="text-xl font-semibold text-text">
          {todayTotal > 0 ? `${todayTotal} minutos registrados` : "Nenhum registro ainda"}
        </p>

        {!showForm ? (
          <button onClick={() => setShowForm(true)} className="mt-4 w-full py-3 rounded-xl bg-green-dark text-white font-medium hover:bg-green transition flex items-center justify-center gap-2">
            <Plus size={16} /> Registrar movimento
          </button>
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Tipo</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MOVEMENT_TYPES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition ${
                      type === t.id ? "bg-green-dark text-white" : "bg-border-light text-text hover:bg-border"
                    }`}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">Duração (minutos)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min={1}
                max={600}
                className="w-full px-3 py-2 rounded-xl border border-border bg-background text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-border-light transition">Cancelar</button>
              <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl bg-green-dark text-white text-sm font-medium hover:bg-green transition">Registrar</button>
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
                  <span className="text-lg">{typeIcon(r.type)}</span>
                  <div>
                    <p className="text-sm font-medium text-text">{typeLabel(r.type)}</p>
                    <p className="text-xs text-text-secondary">{r.durationMinutes} min · {new Date(r.timestamp).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>
                <button onClick={() => deleteMovement(r.id)} className="p-1.5 rounded-lg text-text-secondary hover:text-terracotta hover:bg-border-light transition">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
