"use client";

import React from "react";
import { motion } from "framer-motion";
import { Accessibility, Type, Eye, Volume2, Sparkles, Link as LinkIcon } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function AcessibilidadePage() {
  const fontSize = useAppStore((s) => s.fontSize);
  const setFontSize = useAppStore((s) => s.setFontSize);
  const highContrast = useAppStore((s) => s.highContrast);
  const setHighContrast = useAppStore((s) => s.setHighContrast);
  const reduceAnimations = useAppStore((s) => s.reduceAnimations);
  const setReduceAnimations = useAppStore((s) => s.setReduceAnimations);
  const underlineLinks = useAppStore((s) => s.underlineLinks);
  const setUnderlineLinks = useAppStore((s) => s.setUnderlineLinks);
  const darkMode = useAppStore((s) => s.darkMode);
  const setDarkMode = useAppStore((s) => s.setDarkMode);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1 flex items-center gap-2">
          <Accessibility className="text-blue" /> Acessibilidade
        </h1>
        <p className="text-text-secondary mb-6">Ajuste a interface para suas necessidades.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="space-y-4">
        {/* Font size */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-2 mb-3">
            <Type size={18} className="text-green-dark" />
            <h2 className="font-semibold text-text">Tamanho do texto</h2>
          </div>
          <div className="flex gap-2">
            {(["small", "normal", "large"] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${
                  fontSize === size ? "bg-green-dark text-white" : "bg-border-light text-text hover:bg-border"
                }`}
              >
                {size === "small" ? "Menor" : size === "normal" ? "Normal" : "Maior"}
              </button>
            ))}
          </div>
        </div>

        {/* Toggle options */}
        <div className="bg-card rounded-xl border border-border p-5 space-y-4">
          <ToggleOption
            icon={<Eye size={18} />}
            label="Contraste aumentado"
            description="Aumenta o contraste entre texto e fundo"
            value={highContrast}
            onChange={setHighContrast}
          />
          <ToggleOption
            icon={<Sparkles size={18} />}
            label="Reduzir animações"
            description="Desativa ou reduz animações e transições"
            value={reduceAnimations}
            onChange={setReduceAnimations}
          />
          <ToggleOption
            icon={<LinkIcon size={18} />}
            label="Sublinhar links"
            description="Adiciona sublinhado a todos os links para melhor visibilidade"
            value={underlineLinks}
            onChange={setUnderlineLinks}
          />
          <ToggleOption
            icon={<Volume2 size={18} />}
            label="Tema escuro"
            description="Alterna para tema com fundo escuro"
            value={darkMode}
            onChange={setDarkMode}
          />
        </div>

        {/* Info */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="font-semibold text-text mb-3">Recursos de acessibilidade</h2>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li>• Navegação por teclado com indicador de foco visível</li>
            <li>• Labels e atributos ARIA nos elementos interativos</li>
            <li>• Texto alternativo em imagens</li>
            <li>• Respeito à configuração de movimento reduzido do sistema</li>
            <li>• Contraste adequado entre texto e fundo</li>
            <li>• Layout responsivo para diferentes tamanhos de tela</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

function ToggleOption({ icon, label, description, value, onChange }: {
  icon: React.ReactNode; label: string; description: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="text-green-dark mt-0.5">{icon}</div>
        <div>
          <p className="font-medium text-text text-sm">{label}</p>
          <p className="text-xs text-text-secondary">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-11 h-6 rounded-full transition flex-shrink-0 relative ${
          value ? "bg-green-dark" : "bg-border"
        }`}
      >
        <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-0.5 transition-transform ${
          value ? "translate-x-5" : "translate-x-0.5"
        }`} />
      </button>
    </div>
  );
}
