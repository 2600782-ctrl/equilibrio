"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Lock, RotateCw, Trash2, ZoomIn, ZoomOut, Sparkles, Check, Info, Palette } from "lucide-react";
import { useAppStore, ACHIEVEMENTS_DEF } from "@/lib/store";

// Types
interface PlacedItem {
  id: string;
  itemId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

// All items - rich variety
const ITEMS = [
  // Básicos (livres)
  { id: "desk", name: "Mesa", emoji: "🪑", w: 90, h: 50, category: "Mobília", achievement: null, needLabel: "", tip: "Mesa na altura dos cotovelos em ~90°.", xp: 5 },
  { id: "chair", name: "Cadeira", emoji: "💺", w: 50, h: 60, category: "Mobília", achievement: null, needLabel: "", tip: "Cadeira com suporte lombar. Pés apoiados.", xp: 5 },
  { id: "rug", name: "Tapete", emoji: "🟫", w: 100, h: 60, category: "Decoração", achievement: null, needLabel: "", tip: "Tapete define áreas e traz conforto.", xp: 5 },
  // Perfil
  { id: "monitor", name: "Monitor", emoji: "🖥️", w: 60, h: 45, category: "Tecnologia", achievement: "first_step", needLabel: "Crie seu perfil", tip: "Topo na altura dos olhos, distância de um braço.", xp: 10 },
  { id: "laptop", name: "Notebook", emoji: "💻", w: 50, h: 35, category: "Tecnologia", achievement: "first_step", needLabel: "Crie seu perfil", tip: "Eleve o notebook para altura dos olhos.", xp: 10 },
  // Pomodoro
  { id: "keyboard", name: "Teclado", emoji: "⌨️", w: 55, h: 20, category: "Tecnologia", achievement: "focused", needLabel: "Complete um Pomodoro", tip: "Punhos retos, na altura da mesa.", xp: 10 },
  { id: "mouse", name: "Mouse", emoji: "🖱️", w: 25, h: 25, category: "Tecnologia", achievement: "focused", needLabel: "Complete um Pomodoro", tip: "Próximo ao teclado. Punho reto.", xp: 10 },
  { id: "clock", name: "Relógio", emoji: "🕐", w: 30, h: 30, category: "Organização", achievement: "focused", needLabel: "Complete um Pomodoro", tip: "Acompanhe o tempo sem celular.", xp: 10 },
  // Conteúdo
  { id: "plant", name: "Planta", emoji: "🪴", w: 30, h: 35, category: "Decoração", achievement: "curious", needLabel: "Explore 3 conteúdos", tip: "Plantas melhoram humor e qualidade do ar!", xp: 10 },
  { id: "flower", name: "Flores", emoji: "💐", w: 25, h: 30, category: "Decoração", achievement: "curious", needLabel: "Explore 3 conteúdos", tip: "Cores naturais acalmam o ambiente.", xp: 10 },
  { id: "books", name: "Livros", emoji: "📚", w: 35, h: 30, category: "Organização", achievement: "curious", needLabel: "Explore 3 conteúdos", tip: "Materiais de referência ao alcance.", xp: 10 },
  // EQUI
  { id: "lamp", name: "Luminária", emoji: "💡", w: 25, h: 35, category: "Iluminação", achievement: "hello_equi", needLabel: "Converse com o EQUI", tip: "Iluminação adequada reduz fadiga visual.", xp: 10 },
  { id: "candle", name: "Vela", emoji: "🕯️", w: 15, h: 25, category: "Decoração", achievement: "hello_equi", needLabel: "Converse com o EQUI", tip: "Ambiente acolhedor para pausas.", xp: 10 },
  // Quiz
  { id: "bookshelf", name: "Estante", emoji: "📚", w: 40, h: 60, category: "Organização", achievement: "active_mind", needLabel: "Complete um quiz", tip: "Organize materiais por frequência de uso.", xp: 15 },
  { id: "globe", name: "Globo", emoji: "🌍", w: 30, h: 30, category: "Decoração", achievement: "active_mind", needLabel: "Complete um quiz", tip: "Curiosidade sobre o mundo!", xp: 15 },
  // Check-in
  { id: "window", name: "Janela", emoji: "🪟", w: 50, h: 40, category: "Iluminação", achievement: "first_checkin", needLabel: "Faça um check-in", tip: "Luz natural melhora humor e foco.", xp: 15 },
  { id: "mirror", name: "Espelho", emoji: "🪞", w: 25, h: 40, category: "Decoração", achievement: "first_checkin", needLabel: "Faça um check-in", tip: "Amplia a sensação de espaço.", xp: 15 },
  // Ergonomia
  { id: "poster", name: "Quadro", emoji: "🖼️", w: 40, h: 30, category: "Decoração", achievement: "ergonomics", needLabel: "Desafio de ergonomia", tip: "Ambiente pessoal ajuda na motivação.", xp: 15 },
  { id: "stand", name: "Suporte de monitor", emoji: "📐", w: 40, h: 25, category: "Ergonomia", achievement: "ergonomics", needLabel: "Desafio de ergonomia", tip: "Eleve o monitor à altura dos olhos.", xp: 15 },
  // Autoconhecimento
  { id: "coffee", name: "Café", emoji: "☕", w: 20, h: 20, category: "Conforto", achievement: "self_knowledge", needLabel: "3 check-ins em dias diferentes", tip: "Alterne café com água para hidratação.", xp: 20 },
  { id: "teapot", name: "Chá", emoji: "🫖", w: 25, h: 20, category: "Conforto", achievement: "self_knowledge", needLabel: "3 check-ins em dias diferentes", tip: "Chá verde tem L-teanina, que auxilia foco.", xp: 20 },
  { id: "water", name: "Garrafa de água", emoji: "💧", w: 15, h: 30, category: "Saúde", achievement: "self_knowledge", needLabel: "3 check-ins em dias diferentes", tip: "Mantenha água sempre acessível!", xp: 20 },
  // Concentrado
  { id: "yoga_mat", name: "Tapete yoga", emoji: "🧘", w: 60, h: 20, category: "Movimento", achievement: "concentrated", needLabel: "Complete 5 Pomodoros", tip: "Espaço para alongamento e pausas ativas.", xp: 20 },
  { id: "speaker", name: "Caixa de som", emoji: "🔊", w: 25, h: 20, category: "Tecnologia", achievement: "concentrated", needLabel: "Complete 5 Pomodoros", tip: "Música ambiente pode ajudar no foco.", xp: 20 },
  { id: "headphones", name: "Fones", emoji: "🎧", w: 30, h: 25, category: "Tecnologia", achievement: "concentrated", needLabel: "Complete 5 Pomodoros", tip: "Cancelamento de ruído para concentração.", xp: 20 },
  // Perfeito
  { id: "trophy", name: "Troféu", emoji: "🏆", w: 25, h: 30, category: "Especial", achievement: "perfect_quiz", needLabel: "Acerte 10/10 no quiz", tip: "Conquista especial! ⭐", xp: 30 },
  { id: "stars", name: "Estrelas", emoji: "⭐", w: 30, h: 30, category: "Especial", achievement: "perfect_quiz", needLabel: "Acerte 10/10 no quiz", tip: "Brilho para seu ambiente! ✨", xp: 30 },
];

// Room themes
const ROOM_THEMES = [
  { id: "clean", name: "Claro", floor: "#F6F7F2", wall: "#FFFFFF", wallBorder: "#DDE3DA" },
  { id: "warm", name: "Quente", floor: "#F5F0E6", wall: "#FAF5EB", wallBorder: "#E8DDC8" },
  { id: "cool", name: "Fresco", floor: "#F0F4F2", wall: "#F5FAF8", wallBorder: "#C7DDE5" },
  { id: "nature", name: "Natureza", floor: "#F2F5EE", wall: "#F7FAF4", wallBorder: "#A8C5AB" },
  { id: "dark", name: "Escuro", floor: "#1a1f1c", wall: "#222822", wallBorder: "#333a33" },
];

export default function MonteAmbientePage() {
  const user = useAppStore((s) => s.user);
  const achievements = useAppStore((s) => s.achievements);
  const addXp = useAppStore((s) => s.addXp);
  const addToast = useAppStore((s) => s.addToast);
  const [placed, setPlaced] = useState<PlacedItem[]>([]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedPlaced, setSelectedPlaced] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState(true);
  const [theme, setTheme] = useState("clean");
  const [givenXp, setGivenXp] = useState<Set<string>>(new Set());
  const [showTip, setShowTip] = useState<string | null>(null);
  const roomRef = useRef<HTMLDivElement>(null);

  const name = user?.name || "Visitante";
  const hasAch = (id: string) => achievements.some(a => a.id === id);
  const isUnlocked = (item: typeof ITEMS[0]) => !item.achievement || hasAch(item.achievement);

  const unlockedCount = ITEMS.filter(i => isUnlocked(i)).length;
  const placedTypes = new Set(placed.map(p => p.itemId));

  const currentTheme = ROOM_THEMES.find(t => t.id === theme) || ROOM_THEMES[0];

  // Add item to room at center
  const handleAddItem = useCallback((item: typeof ITEMS[0]) => {
    if (!isUnlocked(item)) return;
    const newPlaced: PlacedItem = {
      id: `${item.id}-${Date.now()}`,
      itemId: item.id,
      x: 150 + Math.random() * 200,
      y: 100 + Math.random() * 150,
      scale: 1,
      rotation: 0,
    };
    setPlaced(prev => [...prev, newPlaced]);
    setSelectedPlaced(newPlaced.id);

    if (!givenXp.has(item.id)) {
      setGivenXp(prev => new Set(prev).add(item.id));
      addXp(item.xp);
      addToast(`${item.name} adicionado! +${item.xp} XP`, "achievement");
    }
  }, [achievements, givenXp, addXp, addToast]);

  // Remove item
  const handleRemove = (id: string) => {
    setPlaced(prev => prev.filter(p => p.id !== id));
    if (selectedPlaced === id) setSelectedPlaced(null);
  };

  // Rotate item
  const handleRotate = (id: string) => {
    setPlaced(prev => prev.map(p => p.id === id ? { ...p, rotation: (p.rotation + 45) % 360 } : p));
  };

  // Scale item
  const handleScale = (id: string, dir: number) => {
    setPlaced(prev => prev.map(p => {
      if (p.id !== id) return p;
      const newScale = Math.max(0.5, Math.min(2.5, p.scale + dir * 0.2));
      return { ...p, scale: Math.round(newScale * 10) / 10 };
    }));
  };

  // Clear all
  const handleClear = () => {
    setPlaced([]);
    setSelectedPlaced(null);
    setGivenXp(new Set());
  };

  const selectedDef = selectedPlaced ? placed.find(p => p.id === selectedPlaced) : null;
  const selectedItemDef = selectedDef ? ITEMS.find(i => i.id === selectedDef.itemId) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1 flex items-center gap-2">
          🏠 Monte Seu Ambiente
        </h1>
        <p className="text-text-secondary mb-1">
          Organize seu espaço do jeito que quiser. Arraste, gire e redimensione!
        </p>
        <p className="text-xs text-text-secondary italic mb-4">
          Itens com 🔒 são desbloqueados por conquistas — use o site para liberar tudo!
        </p>
      </motion.div>

      {/* Top bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-text">
            {unlockedCount}/{ITEMS.length} itens desbloqueados
          </span>
          <span className="text-sm text-text-secondary">
            · {placed.length} colocados
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Theme selector */}
          <div className="flex items-center gap-1">
            <Palette size={14} className="text-text-secondary" />
            {ROOM_THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`w-5 h-5 rounded-full border-2 transition ${theme === t.id ? "border-green-dark scale-110" : "border-border"}`}
                style={{ backgroundColor: t.floor }}
                title={t.name}
              />
            ))}
          </div>
          {placed.length > 0 && (
            <button onClick={handleClear} className="px-3 py-1 rounded-lg text-xs text-text-secondary hover:text-terracotta hover:bg-border-light transition">
              Limpar
            </button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Item panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-3"
        >
          <div className="bg-card rounded-xl border border-border p-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-text text-sm">Itens</h2>
              <span className="text-xs text-text-secondary">{unlockedCount} disponíveis</span>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-1 mb-3">
              {["Todos", "Mobília", "Tecnologia", "Decoração", "Ergonomia", "Conforto", "Especial"].map(cat => (
                <span key={cat} className="text-[10px] px-2 py-0.5 rounded-full bg-border-light text-text-secondary">
                  {cat}
                </span>
              ))}
            </div>

            <div className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
              {ITEMS.map((item) => {
                const unlocked = isUnlocked(item);
                const alreadyPlaced = placedTypes.has(item.id);

                return (
                  <motion.button
                    key={item.id}
                    whileHover={unlocked && !alreadyPlaced ? { scale: 1.02 } : {}}
                    whileTap={unlocked && !alreadyPlaced ? { scale: 0.97 } : {}}
                    onClick={() => unlocked && !alreadyPlaced && handleAddItem(item)}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition ${
                      !unlocked ? "opacity-40 cursor-not-allowed" :
                      alreadyPlaced ? "bg-green-light/20" :
                      "hover:bg-border-light cursor-pointer active:bg-green-light/30"
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{unlocked ? item.emoji : "🔒"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">{item.name}</p>
                      {!unlocked ? (
                        <p className="text-[10px] text-text-secondary flex items-center gap-0.5">
                          <Lock size={8} /> {item.needLabel}
                        </p>
                      ) : alreadyPlaced ? (
                        <p className="text-[10px] text-green-dark flex items-center gap-0.5">
                          <Check size={8} /> No ambiente
                        </p>
                      ) : (
                        <p className="text-[10px] text-text-secondary">{item.category} · +{item.xp} XP</p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Room */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-9"
        >
          <div
            ref={roomRef}
            className="relative rounded-2xl border-2 overflow-hidden select-none"
            style={{
              borderColor: currentTheme.wallBorder,
              minHeight: 480,
              background: `linear-gradient(180deg, ${currentTheme.wall} 0%, ${currentTheme.wall} 60%, ${currentTheme.floor} 60%, ${currentTheme.floor} 100%)`,
            }}
            onClick={() => setSelectedPlaced(null)}
          >
            {/* Wall decorations */}
            <div className="absolute top-3 left-4 text-xs font-medium text-text-secondary/40">
              Espaço de {name}
            </div>

            {/* Floor line */}
            <div className="absolute left-0 right-0 top-[60%] border-t border-dashed" style={{ borderColor: currentTheme.wallBorder }} />

            {/* Grid dots */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{
              backgroundImage: `radial-gradient(circle, ${currentTheme.wallBorder} 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }} />

            {/* Empty state */}
            {placed.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center opacity-30">
                  <p className="text-4xl mb-2">🏠</p>
                  <p className="text-sm font-medium">Clique em um item para adicionar</p>
                  <p className="text-xs">Arraste para mover · Gire e redimensione</p>
                </div>
              </div>
            )}

            {/* Placed items */}
            {placed.map((p) => {
              const def = ITEMS.find(i => i.id === p.itemId);
              if (!def) return null;
              const isSelected = selectedPlaced === p.id;

              return (
                <motion.div
                  key={p.id}
                  drag
                  dragMomentum={false}
                  dragElastic={0}
                  onDragStart={() => { setDraggingId(p.id); setSelectedPlaced(p.id); }}
                  onDragEnd={(_, info) => {
                    setDraggingId(null);
                    setPlaced(prev => prev.map(item =>
                      item.id === p.id ? {
                        ...item,
                        x: item.x + info.offset.x,
                        y: item.y + info.offset.y,
                      } : item
                    ));
                  }}
                  onClick={(e) => { e.stopPropagation(); setSelectedPlaced(p.id); }}
                  className={`absolute cursor-grab active:cursor-grabbing group ${
                    isSelected ? "z-50" : "z-10"
                  }`}
                  style={{
                    left: p.x,
                    top: p.y,
                    transform: `rotate(${p.rotation}deg) scale(${p.scale})`,
                    transformOrigin: "center center",
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  {/* Item visual */}
                  <div className={`relative flex items-center justify-center rounded-xl transition-all ${
                    isSelected ? "ring-2 ring-green-dark ring-offset-2 shadow-lg" : "hover:shadow-md"
                  }`} style={{
                    width: def.w,
                    height: def.h,
                    backgroundColor: theme === "dark" ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.6)",
                    backdropFilter: "blur(4px)",
                    border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}`,
                  }}>
                    <span className="select-none" style={{ fontSize: Math.min(def.w, def.h) * 0.5 }}>
                      {def.emoji}
                    </span>

                    {/* Name tooltip on hover */}
                    <div className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap transition-opacity ${
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-80"
                    }`} style={{ backgroundColor: theme === "dark" ? "#333" : "#fff", color: theme === "dark" ? "#eee" : "#28332B" }}>
                      {def.name}
                    </div>
                  </div>

                  {/* Selection controls */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 z-50"
                      >
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRotate(p.id); }}
                          className="w-6 h-6 rounded-full bg-card shadow flex items-center justify-center hover:bg-border-light transition"
                          title="Girar"
                        >
                          <RotateCw size={11} className="text-text" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleScale(p.id, 1); }}
                          className="w-6 h-6 rounded-full bg-card shadow flex items-center justify-center hover:bg-border-light transition"
                          title="Aumentar"
                        >
                          <ZoomIn size={11} className="text-text" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleScale(p.id, -1); }}
                          className="w-6 h-6 rounded-full bg-card shadow flex items-center justify-center hover:bg-border-light transition"
                          title="Diminuir"
                        >
                          <ZoomOut size={11} className="text-text" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowTip(p.id); }}
                          className="w-6 h-6 rounded-full bg-card shadow flex items-center justify-center hover:bg-border-light transition"
                          title="Dica"
                        >
                          <Info size={11} className="text-text" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRemove(p.id); }}
                          className="w-6 h-6 rounded-full bg-terracotta shadow flex items-center justify-center hover:bg-terracotta-light transition"
                          title="Remover"
                        >
                          <Trash2 size={11} className="text-white" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Tip overlay */}
            <AnimatePresence>
              {showTip && (() => {
                const p = placed.find(i => i.id === showTip);
                const def = p ? ITEMS.find(i => i.id === p.itemId) : null;
                if (!def || !p) return null;
                return (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[60] flex items-center justify-center bg-black/20"
                    onClick={() => setShowTip(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.9 }}
                      className="bg-card rounded-2xl shadow-xl p-6 max-w-xs text-center"
                      onClick={e => e.stopPropagation()}
                    >
                      <span className="text-4xl">{def.emoji}</span>
                      <h3 className="font-bold text-text mt-2">{def.name}</h3>
                      <p className="text-sm text-text-secondary mt-2">{def.tip}</p>
                      <button onClick={() => setShowTip(null)} className="mt-4 px-5 py-2 rounded-xl bg-green-dark text-white text-sm font-medium hover:bg-green transition">
                        Entendi
                      </button>
                    </motion.div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>

          {/* Selected item info */}
          <AnimatePresence>
            {selectedItemDef && selectedDef && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-green-light/20 rounded-xl p-3 mt-3 overflow-hidden"
              >
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-lg">{selectedItemDef.emoji}</span>
                  <span className="font-medium text-green-dark">{selectedItemDef.name}</span>
                  <span className="text-text-secondary">· {selectedItemDef.category}</span>
                  <span className="text-text-secondary ml-auto text-xs">
                    Arraste para mover · Use os botões para girar e redimensionar
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Unlock guide */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl border border-border p-5 mt-6">
        <h2 className="font-semibold text-text mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-terracotta" /> Como desbloquear mais itens
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {ITEMS.filter(item => item.achievement && !isUnlocked(item)).map((item) => {
            const achDef = ACHIEVEMENTS_DEF.find(a => a.id === item.achievement);
            return (
              <div key={item.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-border-light/50">
                <span className="text-lg">🔒</span>
                <div>
                  <p className="text-sm font-medium text-text">{item.name}</p>
                  <p className="text-[10px] text-text-secondary">{achDef?.icon} {item.needLabel}</p>
                </div>
              </div>
            );
          })}
          {ITEMS.filter(item => item.achievement && !isUnlocked(item)).length === 0 && (
            <div className="col-span-full text-center py-4">
              <p className="text-green-dark font-medium">🎉 Todos os itens estão desbloqueados!</p>
            </div>
          )}
        </div>
      </motion.div>

      <p className="text-xs text-text-secondary text-center mt-6 italic">
        As dicas são baseadas em recomendações de ergonomia e não substituem avaliação profissional.
      </p>
    </div>
  );
}
