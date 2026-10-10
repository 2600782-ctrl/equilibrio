"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Trash2, Info } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function PrivacidadePage() {
  const resetAllData = useAppStore((s) => s.resetAllData);
  const user = useAppStore((s) => s.user);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1 flex items-center gap-2">
          <Shield className="text-green" /> Privacidade e Dados
        </h1>
        <p className="text-text-secondary mb-6">Informações sobre como seus dados são tratados.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-4">
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-text mb-3">O que é salvo?</h2>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>• <strong className="text-text">Nome ou apelido:</strong> utilizado para personalizar a experiência</li>
            <li>• <strong className="text-text">Foto de perfil:</strong> armazenada localmente, nunca enviada para serviços externos</li>
            <li>• <strong className="text-text">Registros de hábitos:</strong> hidratação, sono, movimento e foco</li>
            <li>• <strong className="text-text">Check-ins e quizzes:</strong> respostas e resultados</li>
            <li>• <strong className="text-text">Preferências:</strong> configurações de acessibilidade e Pomodoro</li>
            <li>• <strong className="text-text">Progresso:</strong> XP, nível e conquistas</li>
          </ul>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-text mb-3">O que NÃO é coletado</h2>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>• CPF, telefone ou endereço</li>
            <li>• Informações médicas</li>
            <li>• Dados de navegação ou rastreamento</li>
            <li>• A foto de perfil não é enviada para serviços externos</li>
          </ul>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info size={18} className="text-blue" />
            <h2 className="font-semibold text-text">Armazenamento local</h2>
          </div>
          <p className="text-sm text-text-secondary mb-3">
            Todos os dados são armazenados localmente no seu navegador (localStorage). Nada é enviado para servidores externos
            sem sua ação explícita.
          </p>
          <p className="text-sm text-text-secondary">
            Isso significa que se você limpar os dados do navegador, seus registros serão perdidos.
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-text mb-3">Apagar seus dados</h2>
          <p className="text-sm text-text-secondary mb-4">
            Você pode apagar todos os seus dados a qualquer momento. Isso removerá seu perfil, registros, conquistas e configurações.
          </p>
          <button
            onClick={resetAllData}
            className="px-4 py-2.5 rounded-xl bg-terracotta text-white text-sm font-medium hover:bg-terracotta-light transition flex items-center gap-2"
          >
            <Trash2 size={14} /> Apagar todos os dados
          </button>
        </div>
      </motion.div>
    </div>
  );
}
