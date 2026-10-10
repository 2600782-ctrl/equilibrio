"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Droplets, Moon, Target, Activity, ClipboardCheck, Trophy, ArrowRight, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { useAppStore, getLevelFromXp } from "@/lib/store";

export default function DashboardPage() {
  const user = useAppStore((s) => s.user);
  const xp = useAppStore((s) => s.xp);
  const hydrationRecords = useAppStore((s) => s.hydrationRecords);
  const sleepRecords = useAppStore((s) => s.sleepRecords);
  const movementRecords = useAppStore((s) => s.movementRecords);
  const focusRecords = useAppStore((s) => s.focusRecords);
  const checkinRecords = useAppStore((s) => s.checkinRecords);
  const achievements = useAppStore((s) => s.achievements);

  const { level, currentXp, nextLevelXp } = getLevelFromXp(xp);
  const name = user?.name || "Visitante";
  const today = new Date().toISOString().slice(0, 10);

  // Today's data
  const todayHydration = hydrationRecords.filter(r => r.timestamp.slice(0, 10) === today);
  const todayHydrationTotal = todayHydration.reduce((s, r) => s + r.amountMl, 0);
  const todayFocus = focusRecords.filter(r => r.timestamp.slice(0, 10) === today && r.completed);
  const todayMovement = movementRecords.filter(r => r.timestamp.slice(0, 10) === today);
  const lastCheckin = checkinRecords.length > 0 ? checkinRecords[checkinRecords.length - 1] : null;
  const lastSleep = sleepRecords.length > 0 ? sleepRecords[sleepRecords.length - 1] : null;

  // Weekly hydration chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = d.toLocaleDateString("pt-BR", { weekday: "short" });
    const total = hydrationRecords.filter(r => r.timestamp.slice(0, 10) === dateStr).reduce((s, r) => s + r.amountMl, 0);
    return { day: dayLabel, ml: total };
  });

  // Weekly focus chart
  const focusWeek = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = d.toLocaleDateString("pt-BR", { weekday: "short" });
    const count = focusRecords.filter(r => r.timestamp.slice(0, 10) === dateStr && r.completed).length;
    return { day: dayLabel, sessions: count };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1">Meu Bem-Estar</h1>
        <p className="text-text-secondary mb-6">Olá, {name}. Aqui estão seus registros.</p>
      </motion.div>

      {/* Level/XP bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-terracotta" />
            <span className="font-semibold text-text">Nível {level}</span>
          </div>
          <span className="text-sm text-text-secondary">{currentXp} / {nextLevelXp} XP</span>
        </div>
        <div className="w-full h-2.5 bg-border-light rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentXp / nextLevelXp) * 100}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-green-dark rounded-full"
          />
        </div>
      </motion.div>

      {/* Quick stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard
          icon={<Droplets size={20} className="text-blue" />}
          title="Hidratação"
          value={todayHydrationTotal > 0 ? `${todayHydrationTotal} ml hoje` : "Nenhum registro ainda"}
          link="/hidratacao"
          linkLabel="Registrar"
        />
        <StatCard
          icon={<Moon size={20} className="text-terracotta" />}
          title="Sono"
          value={lastSleep ? `Último: ${lastSleep.durationMinutes}min` : "Nenhum registro ainda"}
          link="/sono"
          linkLabel="Registrar"
        />
        <StatCard
          icon={<Target size={20} className="text-green-dark" />}
          title="Foco"
          value={todayFocus.length > 0 ? `${todayFocus.length} sessão(ões) hoje` : "Nenhum registro ainda"}
          link="/foco"
          linkLabel="Iniciar"
        />
        <StatCard
          icon={<Activity size={20} className="text-green" />}
          title="Movimento"
          value={todayMovement.length > 0 ? `${todayMovement.length} registro(s)` : "Nenhum registro ainda"}
          link="/movimento"
          linkLabel="Registrar"
        />
        <StatCard
          icon={<ClipboardCheck size={20} className="text-blue-dark" />}
          title="Check-in"
          value={lastCheckin ? `Último: ${new Date(lastCheckin.timestamp).toLocaleDateString("pt-BR")}` : "Pendente"}
          link="/checkin"
          linkLabel={lastCheckin ? "Novo Check-in" : "Fazer Check-in"}
        />
        <StatCard
          icon={<Trophy size={20} className="text-terracotta" />}
          title="Conquistas"
          value={`${achievements.length} desbloqueada(s)`}
          link="/conquistas"
          linkLabel="Ver todas"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-text mb-4 flex items-center gap-2"><Droplets size={16} className="text-blue" /> Hidratação — 7 dias</h3>
          {last7Days.some(d => d.ml > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={last7Days}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="ml" fill="#78A7BB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-text-secondary text-sm py-8 text-center">Nenhum registro ainda.</p>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-text mb-4 flex items-center gap-2"><Target size={16} className="text-green-dark" /> Foco — 7 dias</h3>
          {focusWeek.some(d => d.sessions > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={focusWeek}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="sessions" stroke="#41604A" strokeWidth={2} dot={{ fill: "#41604A" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-text-secondary text-sm py-8 text-center">Nenhum registro ainda.</p>
          )}
        </motion.div>
      </div>

      {/* Recent achievements */}
      {achievements.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-card rounded-xl border border-border p-5">
          <h3 className="font-semibold text-text mb-4">Conquistas recentes</h3>
          <div className="flex flex-wrap gap-3">
            {achievements.slice(-6).reverse().map((a) => (
              <div key={a.id} className="flex items-center gap-2 bg-border-light rounded-lg px-3 py-2">
                <span className="text-lg">{a.icon}</span>
                <span className="text-sm font-medium text-text">{a.title}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-text-secondary text-center mt-8 italic">
        Os gráficos apresentam seus registros pessoais e não constituem avaliação de saúde.
      </p>
    </div>
  );
}

function StatCard({ icon, title, value, link, linkLabel }: { icon: React.ReactNode; title: string; value: string; link: string; linkLabel: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-5 hover:shadow-sm transition">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="font-semibold text-text text-sm">{title}</h3>
      </div>
      <p className="text-text-secondary text-sm mb-3">{value}</p>
      <Link href={link} className="inline-flex items-center gap-1 text-xs font-medium text-green-dark hover:text-green transition">
        {linkLabel} <ArrowRight size={12} />
      </Link>
    </motion.div>
  );
}
