"use client";

import React from "react";
import { motion } from "framer-motion";
import { Info, Users, GraduationCap } from "lucide-react";

const TEAM = ["Arthur", "Symon", "Lorenzo", "João", "Julia Nicole"];

export default function SobrePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1 flex items-center gap-2">
          <Info className="text-green" /> Sobre o Equilíbrio
        </h1>
        <p className="text-text-secondary mb-6">Conheça o projeto.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-6 mb-6">
        <h2 className="font-semibold text-text mb-3">O que é o Equilíbrio?</h2>
        <p className="text-sm text-text-secondary mb-3">
          O Equilíbrio é uma plataforma interativa sobre saúde e bem-estar, desenvolvida para a EXPOTEC 2026.
          Reúne ferramentas para acompanhamento de hábitos, organização de momentos de foco, aprendizado e autoconhecimento.
        </p>
        <p className="text-sm text-text-secondary mb-3">
          A plataforma inclui registro de hidratação, sono e movimento, timer Pomodoro, ergonomia interativa,
          pausa guiada, biblioteca educativa, check-in de bem-estar, quiz de conhecimentos, assistente virtual EQUI,
          sistema de XP e conquistas, e mais.
        </p>
        <p className="text-sm text-text-secondary italic">
          O Equilíbrio possui finalidade educativa e informativa. Não realiza diagnósticos e não substitui
          acompanhamento de profissionais de saúde.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="bg-card rounded-xl border border-border p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap size={18} className="text-green-dark" />
          <h2 className="font-semibold text-text">EXPOTEC 2026</h2>
        </div>
        <p className="text-sm text-text-secondary">
          Projeto apresentado na EXPOTEC 2026 — Curso Técnico em Informática.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-3">
          <Users size={18} className="text-green-dark" />
          <h2 className="font-semibold text-text">Integrantes</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {TEAM.map((name) => (
            <span key={name} className="px-4 py-2 rounded-xl bg-green-light text-green-dark text-sm font-medium">
              {name}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
