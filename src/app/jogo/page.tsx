"use client";

import React from "react";
import { motion } from "framer-motion";
import { Gamepad2, Clock, Map, Swords, Shield, Sparkles } from "lucide-react";

export default function JogoPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1 flex items-center gap-2">
          <Gamepad2 className="text-green" /> Ecos do Equilíbrio
        </h1>
        <p className="text-text-secondary mb-2">EM BREVE</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-8 mb-6 text-center">
        <div className="w-20 h-20 rounded-2xl bg-green-light flex items-center justify-center mx-auto mb-6">
          <Gamepad2 size={40} className="text-green-dark" />
        </div>
        <h2 className="text-2xl font-bold text-green-dark mb-3">Ecos do Equilíbrio</h2>
        <p className="text-text-secondary max-w-lg mx-auto mb-6">
          Uma aventura 2D está sendo desenvolvida para expandir o universo do Equilíbrio.
          Explore, descubra segredos e encontre equilíbrio em um mundo interconectado.
        </p>
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-beige text-green-dark font-medium">
          <Clock size={16} /> Em breve
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {[
          { icon: Map, label: "Exploração", desc: "Mapa interconectado com áreas únicas" },
          { icon: Swords, label: "Combate", desc: "Enfrente desafios e chefes" },
          { icon: Sparkles, label: "Habilidades", desc: "Desbloqueie poderes e técnicas" },
          { icon: Shield, label: "Segredos", desc: "Descubra áreas ocultas e lore" },
          { icon: Gamepad2, label: "Plataforma", desc: "Movimentação fluida e precisa" },
          { icon: Clock, label: "Progressão", desc: "Avance e conecte com o site" },
        ].map((item, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4 text-center">
            <item.icon size={24} className="text-green mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-text">{item.label}</h3>
            <p className="text-xs text-text-secondary mt-1">{item.desc}</p>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl border border-border p-5">
        <h2 className="font-semibold text-text mb-2">Sobre o jogo</h2>
        <p className="text-sm text-text-secondary mb-3">
          Ecos do Equilíbrio será uma aventura 2D de exploração e plataforma, inspirada na qualidade de movimentação
          de jogos do gênero, mas com identidade própria — personagens, história, arte e mundo originais.
        </p>
        <p className="text-sm text-text-secondary mb-3">
          O jogo será desenvolvido separadamente e, quando pronto, será integrado ao site. A seção &ldquo;Em breve&rdquo; será
          substituída por um botão &ldquo;Jogar agora&rdquo;.
        </p>
        <p className="text-xs text-text-secondary italic">
          Personagens, arte, nomes, mapa, história, inimigos, música, interface e assets são todos originais do projeto.
        </p>
      </motion.div>
    </div>
  );
}
