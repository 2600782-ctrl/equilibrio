"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Plus, Edit3, Trash2, X, Clock } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function HidratacaoPage() {
  const records = useAppStore((s) => s.hydrationRecords);
  const addHydration = useAppStore((s) => s.addHydration);
  const editHydration = useAppStore((s) => s.editHydration);
  const deleteHydration = useAppStore((s) => s.deleteHydration);
  const [customOpen, setCustomOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");

  const today = new Date().toISOString().slice(0, 10);
  const todayRecords = records.filter(r => r.timestamp.slice(0, 10) === today);
  const todayTotal = todayRecords.reduce((s, r) => s + r.amountMl, 0);
  const waterLevel = Math.min(todayTotal / 2500, 1); // Visual reference, not a universal goal

  const handleAdd = (amount: number) => {
    addHydration(amount);
  };

  const handleCustomAdd = () => {
    const val = parseInt(customAmount);
    if (val > 0 && val <= 5000) {
      addHydration(val);
      setCustomOpen(false);
      setCustomAmount("");
    }
  };

  const handleEdit = (id: string, currentAmount: number) => {
    setEditingId(id);
    setEditAmount(currentAmount.toString());
  };

  const handleEditSave = () => {
    if (editingId) {
      const val = parseInt(editAmount);
      if (val > 0 && val <= 5000) {
        editHydration(editingId, val);
      }
      setEditingId(null);
      setEditAmount("");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1 flex items-center gap-2">
          <Droplets className="text-blue" /> Hidratação
        </h1>
        <p className="text-text-secondary mb-6">Registre sua hidratação ao longo do dia.</p>
      </motion.div>

      {/* Water bottle visualization */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Bottle */}
          <div className="relative w-32 h-48 rounded-b-3xl rounded-t-xl border-2 border-blue overflow-hidden bg-blue-light/30 flex-shrink-0">
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-blue/40"
              initial={{ height: 0 }}
              animate={{ height: `${waterLevel * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-blue-dark">{todayTotal} ml</span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm text-text-secondary mb-1">Hoje</p>
            <p className="text-xl font-semibold text-text">
              {todayTotal > 0 ? `${todayTotal} ml registrados` : "Nenhum registro ainda"}
            </p>
            <p className="text-xs text-text-secondary mt-2 italic">
              As necessidades de hidratação variam por pessoa. Não existe uma meta universal.
            </p>
          </div>
        </div>

        {/* Quick add buttons */}
        <div className="flex flex-wrap gap-2 mt-6 justify-center sm:justify-start">
          {[200, 250, 500].map(amount => (
            <motion.button
              key={amount}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleAdd(amount)}
              className="px-4 py-2.5 rounded-xl bg-blue-light text-blue-dark font-medium text-sm hover:bg-blue hover:text-white transition flex items-center gap-1"
            >
              <Plus size={14} /> {amount} ml
            </motion.button>
          ))}
          <button
            onClick={() => setCustomOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-border bg-background text-text font-medium text-sm hover:bg-border-light transition"
          >
            Outra quantidade
          </button>
        </div>
      </motion.div>

      {/* History */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold text-text mb-4">Registros de hoje</h2>
        {todayRecords.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-text-secondary text-sm mb-2">Nenhum registro ainda.</p>
            <button onClick={() => handleAdd(250)} className="text-sm font-medium text-green-dark hover:text-green transition">
              Fazer primeiro registro
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {todayRecords.slice().reverse().map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-border-light last:border-0">
                <div className="flex items-center gap-3">
                  <Droplets size={14} className="text-blue" />
                  <span className="text-sm font-medium text-text">{r.amountMl} ml</span>
                  <span className="text-xs text-text-secondary">
                    <Clock size={10} className="inline mr-1" />
                    {new Date(r.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {editingId === r.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-20 px-2 py-1 rounded border border-border text-sm"
                        autoFocus
                      />
                      <button onClick={handleEditSave} className="p-1 rounded text-green-dark hover:bg-border-light">✓</button>
                      <button onClick={() => setEditingId(null)} className="p-1 rounded text-text-secondary hover:bg-border-light">✕</button>
                    </div>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(r.id, r.amountMl)} className="p-1.5 rounded-lg text-text-secondary hover:text-blue hover:bg-border-light transition" title="Editar">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => deleteHydration(r.id)} className="p-1.5 rounded-lg text-text-secondary hover:text-terracotta hover:bg-border-light transition" title="Excluir">
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Custom amount modal */}
      <AnimatePresence>
        {customOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/30" onClick={() => setCustomOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-card rounded-2xl shadow-xl p-6 max-w-sm w-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-text">Outra quantidade</h3>
                  <button onClick={() => setCustomOpen(false)} className="p-1 rounded-lg hover:bg-border-light"><X size={16} /></button>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="0"
                    className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-lg text-text focus:ring-2 focus:ring-green outline-none"
                    autoFocus
                  />
                  <span className="text-text-secondary font-medium">ml</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setCustomOpen(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-border-light transition">Cancelar</button>
                  <button onClick={handleCustomAdd} className="flex-1 py-2.5 rounded-xl bg-green-dark text-white text-sm font-medium hover:bg-green transition">Adicionar</button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
