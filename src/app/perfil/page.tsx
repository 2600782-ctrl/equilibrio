"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { User, Camera, Trash2, Save, Star } from "lucide-react";
import { useAppStore, getLevelFromXp } from "@/lib/store";

export default function PerfilPage() {
  const user = useAppStore((s) => s.user);
  const updateUserName = useAppStore((s) => s.updateUserName);
  const updateUserAvatar = useAppStore((s) => s.updateUserAvatar);
  const xp = useAppStore((s) => s.xp);
  const achievements = useAppStore((s) => s.achievements);
  const focusRecords = useAppStore((s) => s.focusRecords);
  const quizRecords = useAppStore((s) => s.quizRecords);
  const checkinRecords = useAppStore((s) => s.checkinRecords);
  const hydrationRecords = useAppStore((s) => s.hydrationRecords);
  const sleepRecords = useAppStore((s) => s.sleepRecords);
  const movementRecords = useAppStore((s) => s.movementRecords);
  const ergonomicsCompleted = useAppStore((s) => s.ergonomicsCompleted);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(user?.name || "");
  const fileRef = useRef<HTMLInputElement>(null);

  const { level, currentXp, nextLevelXp } = getLevelFromXp(xp);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <p className="text-text-secondary">Crie seu perfil para começar.</p>
      </div>
    );
  }

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 200;
        let w = img.width, h = img.height;
        if (w > h) { h = (h / w) * MAX; w = MAX; }
        else { w = (w / h) * MAX; h = MAX; }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
        updateUserAvatar(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateUserName(nameInput.trim());
      setEditingName(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-6 flex items-center gap-2">
          <User className="text-green" /> Meu Perfil
        </h1>
      </motion.div>

      {/* Profile card */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-green">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-green-light flex items-center justify-center text-3xl font-bold text-green-dark">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-green-dark text-white flex items-center justify-center hover:bg-green transition"
            >
              <Camera size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
          </div>

          {/* Name & level */}
          <div className="text-center sm:text-left flex-1">
            {editingName ? (
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-border text-lg font-semibold"
                  autoFocus
                />
                <button onClick={handleSaveName} className="p-2 rounded-lg bg-green-dark text-white hover:bg-green transition">
                  <Save size={16} />
                </button>
              </div>
            ) : (
              <h2 className="text-xl font-bold text-text mb-1 flex items-center gap-2 justify-center sm:justify-start">
                {user.name}
                <button onClick={() => { setEditingName(true); setNameInput(user.name); }} className="text-text-secondary hover:text-text transition text-sm font-normal">
                  editar
                </button>
              </h2>
            )}
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Star size={14} className="text-terracotta" />
              <span className="text-sm font-medium text-text">Nível {level}</span>
              <span className="text-xs text-text-secondary">· {xp} XP</span>
            </div>
            <div className="w-full max-w-xs mt-2 h-2 bg-border-light rounded-full overflow-hidden">
              <div className="h-full bg-green-dark rounded-full" style={{ width: `${(currentXp / nextLevelXp) * 100}%` }} />
            </div>
          </div>

          {/* Remove photo */}
          {user.avatarUrl && (
            <button
              onClick={() => updateUserAvatar(null)}
              className="p-2 rounded-lg text-text-secondary hover:text-terracotta hover:bg-border-light transition"
              title="Remover foto"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border p-5 mb-6">
        <h2 className="font-semibold text-text mb-4">Estatísticas</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatItem label="Quizzes concluídos" value={quizRecords.length.toString()} />
          <StatItem label="Pomodoros" value={focusRecords.filter(r => r.completed).length.toString()} />
          <StatItem label="Check-ins" value={checkinRecords.length.toString()} />
          <StatItem label="Hidratação (registros)" value={hydrationRecords.length.toString()} />
          <StatItem label="Sono (registros)" value={sleepRecords.length.toString()} />
          <StatItem label="Movimento (registros)" value={movementRecords.length.toString()} />
          <StatItem label="Conquistas" value={achievements.length.toString()} />
          <StatItem label="Desafio ergonomia" value={ergonomicsCompleted ? "Concluído" : "Pendente"} />
          <StatItem label="XP total" value={xp.toString()} />
        </div>
      </motion.div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-border-light text-center">
      <p className="text-lg font-semibold text-text">{value}</p>
      <p className="text-xs text-text-secondary">{label}</p>
    </div>
  );
}
