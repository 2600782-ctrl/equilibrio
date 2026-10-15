"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Droplets, Moon, Target, ClipboardCheck, Laptop, MessageCircle, ArrowRight, Sparkles, Activity, TrendingUp, Home } from "lucide-react";
import { useAppStore, getLevelFromXp } from "@/lib/store";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function HomePage() {
  const user = useAppStore((s) => s.user);
  const xp = useAppStore((s) => s.xp);
  const hydrationRecords = useAppStore((s) => s.hydrationRecords);
  const focusRecords = useAppStore((s) => s.focusRecords);
  const movementRecords = useAppStore((s) => s.movementRecords);
  const checkinRecords = useAppStore((s) => s.checkinRecords);
  const sleepRecords = useAppStore((s) => s.sleepRecords);
  const { level, currentXp, nextLevelXp } = getLevelFromXp(xp);

  const name = user?.name || "Visitante";
  const today = new Date().toISOString().slice(0, 10);
  const todayHydration = hydrationRecords.filter((r) => r.timestamp.slice(0, 10) === today);
  const todayHydrationTotal = todayHydration.reduce((sum, r) => sum + r.amountMl, 0);
  const todayFocus = focusRecords.filter((r) => r.timestamp.slice(0, 10) === today && r.completed);
  const todayMovement = movementRecords.filter((r) => r.timestamp.slice(0, 10) === today);
  const lastCheckin = checkinRecords.length > 0 ? checkinRecords[checkinRecords.length - 1] : null;
  const lastSleep = sleepRecords.length > 0 ? sleepRecords[sleepRecords.length - 1] : null;

  const quickAccess = [
    { href: "/hidratacao", label: "Hidratação", desc: "Registre sua hidratação.", icon: Droplets, action: "Registrar", color: "bg-blue-light text-blue-dark" },
    { href: "/sono", label: "Sono", desc: "Registre seu sono.", icon: Moon, action: "Registrar", color: "bg-beige text-terracotta" },
    { href: "/foco", label: "Foco", desc: "Inicie uma sessão de concentração.", icon: Target, action: "Começar", color: "bg-green-light text-green-dark" },
    { href: "/checkin", label: "Check-in", desc: "Como você está hoje?", icon: ClipboardCheck, action: "Fazer Check-in", color: "bg-border-light text-text" },
    { href: "/ergonomia", label: "Ergonomia", desc: "Explore sua estação.", icon: Laptop, action: "Explorar", color: "bg-beige text-green-dark" },
    { href: "/equi", label: "EQUI", desc: "Converse com o assistente.", icon: MessageCircle, action: "Conversar", color: "bg-green-light text-green-dark" },
  { href: "/jogo", label: "Ambiente", desc: "Monte seu espaço de trabalho.", icon: Home, action: "Montar", color: "bg-beige text-terracotta" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <motion.section {...fadeUp} className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-green-dark mb-3">
          Olá, {name}.
        </h1>
        <p className="text-lg text-text-secondary mb-2">
          Seu espaço para informação, organização e bem-estar.
        </p>
        <p className="text-sm text-text-secondary max-w-xl mx-auto mb-6">
          Explore ferramentas para acompanhar seus hábitos, organizar momentos de foco e aprender mais sobre bem-estar.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/dashboard" className="px-6 py-3 rounded-xl bg-green-dark text-white font-medium hover:bg-green transition flex items-center gap-2">
            Acessar Meu Bem-Estar <ArrowRight size={16} />
          </Link>
          <Link href="/hidratacao" className="px-6 py-3 rounded-xl border border-border bg-card text-text font-medium hover:bg-border-light transition">
            Explorar Ferramentas
          </Link>
        </div>
      </motion.section>

      {/* Quick Access */}
      <motion.section {...fadeUp} transition={{ delay: 0.1 }} className="mb-12">
        <h2 className="text-xl font-semibold text-text mb-6 text-center">O que você deseja fazer?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickAccess.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Link href={item.href} className="block bg-card rounded-xl border border-border p-5 hover:shadow-md hover:border-green transition group">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text text-sm">{item.label}</h3>
                    <p className="text-text-secondary text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-green-dark group-hover:text-green transition flex items-center gap-1">
                  {item.action} <ArrowRight size={12} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Today Summary */}
      <motion.section {...fadeUp} transition={{ delay: 0.2 }} className="mb-12">
        <h2 className="text-xl font-semibold text-text mb-4">Resumo de hoje</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <SummaryCard icon={<Droplets size={16} />} label="Hidratação" value={todayHydrationTotal > 0 ? `${todayHydrationTotal} ml` : "Nenhum registro"} />
          <SummaryCard icon={<Moon size={16} />} label="Sono" value={lastSleep ? `${lastSleep.durationMinutes}min` : "Nenhum registro"} />
          <SummaryCard icon={<Target size={16} />} label="Foco" value={todayFocus.length > 0 ? `${todayFocus.length} sessão(ões)` : "Nenhum registro"} />
          <SummaryCard icon={<Activity size={16} />} label="Movimento" value={todayMovement.length > 0 ? `${todayMovement.length} registro(s)` : "Nenhum registro"} />
          <SummaryCard icon={<ClipboardCheck size={16} />} label="Check-in" value={lastCheckin ? "Feito" : "Pendente"} />
          <SummaryCard icon={<Sparkles size={16} />} label="XP" value={`${xp} XP`} />
        </div>
      </motion.section>

      {/* Game teaser */}
      <motion.section {...fadeUp} transition={{ delay: 0.3 }} className="mb-8">
        <div className="bg-card rounded-xl border border-border p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Interativo</p>
          <h2 className="text-xl font-bold text-green-dark mb-2">🏠 Monte Seu Ambiente</h2>
          <p className="text-sm text-text-secondary max-w-md mx-auto mb-4">
            Organize seu espaço de trabalho e desbloqueie itens conquistando conquistas!
          </p>
          <Link href="/jogo" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-dark text-white text-sm font-medium hover:bg-green transition">
            Montar ambiente <ArrowRight size={14} />
          </Link>
        </div>
      </motion.section>
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card rounded-xl border border-border p-3 text-center">
      <div className="flex justify-center mb-1 text-green">{icon}</div>
      <p className="text-xs text-text-secondary mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-text truncate">{value}</p>
    </div>
  );
}
