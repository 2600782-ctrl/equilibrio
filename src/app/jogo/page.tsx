"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Lock, RotateCw, Trash2, ZoomIn, ZoomOut, Info, Palette, Check, Sparkles } from "lucide-react";
import { useAppStore, ACHIEVEMENTS_DEF } from "@/lib/store";

interface PlacedItem {
  id: string;
  itemId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

const ITEMS = [
  { id: "desk", name: "Mesa", emoji: "🪑", size: 50, category: "Mobília", achievement: null, needLabel: "", tip: "Mesa na altura dos cotovelos em ~90°.", xp: 5 },
  { id: "chair", name: "Cadeira", emoji: "💺", size: 40, category: "Mobília", achievement: null, needLabel: "", tip: "Cadeira com suporte lombar. Pés apoiados.", xp: 5 },
  { id: "rug", name: "Tapete", emoji: "🟫", size: 45, category: "Decoração", achievement: null, needLabel: "", tip: "Tapete define áreas e traz conforto.", xp: 5 },
  { id: "monitor", name: "Monitor", emoji: "🖥️", size: 38, category: "Tecnologia", achievement: "first_step", needLabel: "Crie seu perfil", tip: "Topo na altura dos olhos, distância de um braço.", xp: 10 },
  { id: "laptop", name: "Notebook", emoji: "💻", size: 35, category: "Tecnologia", achievement: "first_step", needLabel: "Crie seu perfil", tip: "Eleve o notebook para altura dos olhos.", xp: 10 },
  { id: "keyboard", name: "Teclado", emoji: "⌨️", size: 30, category: "Tecnologia", achievement: "focused", needLabel: "Complete um Pomodoro", tip: "Punhos retos, na altura da mesa.", xp: 10 },
  { id: "mouse", name: "Mouse", emoji: "🖱️", size: 25, category: "Tecnologia", achievement: "focused", needLabel: "Complete um Pomodoro", tip: "Próximo ao teclado. Punho reto.", xp: 10 },
  { id: "clock", name: "Relógio", emoji: "🕐", size: 28, category: "Organização", achievement: "focused", needLabel: "Complete um Pomodoro", tip: "Acompanhe o tempo sem celular.", xp: 10 },
  { id: "plant", name: "Planta", emoji: "🪴", size: 30, category: "Decoração", achievement: "curious", needLabel: "Explore 3 conteúdos", tip: "Plantas melhoram humor e qualidade do ar!", xp: 10 },
  { id: "flower", name: "Flores", emoji: "💐", size: 25, category: "Decoração", achievement: "curious", needLabel: "Explore 3 conteúdos", tip: "Cores naturais acalmam o ambiente.", xp: 10 },
  { id: "books", name: "Livros", emoji: "📚", size: 28, category: "Organização", achievement: "curious", needLabel: "Explore 3 conteúdos", tip: "Materiais de referência ao alcance.", xp: 10 },
  { id: "lamp", name: "Luminária", emoji: "💡", size: 26, category: "Iluminação", achievement: "hello_equi", needLabel: "Converse com o EQUI", tip: "Iluminação adequada reduz fadiga visual.", xp: 10 },
  { id: "candle", name: "Vela", emoji: "🕯️", size: 20, category: "Decoração", achievement: "hello_equi", needLabel: "Converse com o EQUI", tip: "Ambiente acolhedor para pausas.", xp: 10 },
  { id: "bookshelf", name: "Estante", emoji: "📖", size: 35, category: "Organização", achievement: "active_mind", needLabel: "Complete um quiz", tip: "Organize materiais por frequência de uso.", xp: 15 },
  { id: "globe", name: "Globo", emoji: "🌍", size: 28, category: "Decoração", achievement: "active_mind", needLabel: "Complete um quiz", tip: "Curiosidade sobre o mundo!", xp: 15 },
  { id: "window", name: "Janela", emoji: "🪟", size: 35, category: "Iluminação", achievement: "first_checkin", needLabel: "Faça um check-in", tip: "Luz natural melhora humor e foco.", xp: 15 },
  { id: "mirror", name: "Espelho", emoji: "🪞", size: 28, category: "Decoração", achievement: "first_checkin", needLabel: "Faça um check-in", tip: "Amplia a sensação de espaço.", xp: 15 },
  { id: "poster", name: "Quadro", emoji: "🖼️", size: 30, category: "Decoração", achievement: "ergonomics", needLabel: "Desafio de ergonomia", tip: "Ambiente pessoal ajuda na motivação.", xp: 15 },
  { id: "stand", name: "Suporte monitor", emoji: "📐", size: 26, category: "Ergonomia", achievement: "ergonomics", needLabel: "Desafio de ergonomia", tip: "Eleve o monitor à altura dos olhos.", xp: 15 },
  { id: "coffee", name: "Café", emoji: "☕", size: 22, category: "Conforto", achievement: "self_knowledge", needLabel: "3 check-ins em dias diferentes", tip: "Alterne café com água para hidratação.", xp: 20 },
  { id: "teapot", name: "Chá", emoji: "🫖", size: 24, category: "Conforto", achievement: "self_knowledge", needLabel: "3 check-ins em dias diferentes", tip: "Chá verde tem L-teanina, que auxilia foco.", xp: 20 },
  { id: "water", name: "Água", emoji: "💧", size: 22, category: "Saúde", achievement: "self_knowledge", needLabel: "3 check-ins em dias diferentes", tip: "Mantenha água sempre acessível!", xp: 20 },
  { id: "yoga_mat", name: "Tapete yoga", emoji: "🧘", size: 32, category: "Movimento", achievement: "concentrated", needLabel: "Complete 5 Pomodoros", tip: "Espaço para alongamento e pausas ativas.", xp: 20 },
  { id: "speaker", name: "Caixa de som", emoji: "🔊", size: 24, category: "Tecnologia", achievement: "concentrated", needLabel: "Complete 5 Pomodoros", tip: "Música ambiente pode ajudar no foco.", xp: 20 },
  { id: "headphones", name: "Fones", emoji: "🎧", size: 26, category: "Tecnologia", achievement: "concentrated", needLabel: "Complete 5 Pomodoros", tip: "Cancelamento de ruído para concentração.", xp: 20 },
  { id: "trophy", name: "Troféu", emoji: "🏆", size: 28, category: "Especial", achievement: "perfect_quiz", needLabel: "Acerte 10/10 no quiz", tip: "Conquista especial! ⭐", xp: 30 },
  { id: "stars", name: "Estrelas", emoji: "⭐", size: 26, category: "Especial", achievement: "perfect_quiz", needLabel: "Acerte 10/10 no quiz", tip: "Brilho para seu ambiente! ✨", xp: 30 },
];

const THEMES = [
  { id: "clean", name: "Claro", floor: "#F6F7F2", wall: "#FFFFFF", border: "#DDE3DA", text: "#28332B" },
  { id: "warm", name: "Quente", floor: "#F5F0E6", wall: "#FAF5EB", border: "#E8DDC8", text: "#28332B" },
  { id: "cool", name: "Fresco", floor: "#F0F4F2", wall: "#F5FAF8", border: "#C7DDE5", text: "#28332B" },
  { id: "nature", name: "Natureza", floor: "#F2F5EE", wall: "#F7FAF4", border: "#A8C5AB", text: "#28332B" },
  { id: "dark", name: "Escuro", floor: "#222822", wall: "#1a1f1c", border: "#444", text: "#e0e5dc" },
];

export default function MonteAmbientePage() {
  const user = useAppStore((s) => s.user);
  const achievements = useAppStore((s) => s.achievements);
  const addXp = useAppStore((s) => s.addXp);
  const addToast = useAppStore((s) => s.addToast);

  const [placed, setPlaced] = useState<PlacedItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [theme, setTheme] = useState("clean");
  const [givenXp, setGivenXp] = useState<Set<string>>(new Set());
  const [tipItem, setTipItem] = useState<string | null>(null);

  // Drag state
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const roomRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const name = user?.name || "Visitante";
  const hasAch = (id: string) => achievements.some(a => a.id === id);
  const isUnlocked = (item: typeof ITEMS[0]) => !item.achievement || hasAch(item.achievement);
  const currentTheme = THEMES.find(t => t.id === theme) || THEMES[0];
  const unlockedCount = ITEMS.filter(i => isUnlocked(i)).length;
  const placedTypes = new Set(placed.map(p => p.itemId));

  // Add item to room
  const handleAddItem = useCallback((item: typeof ITEMS[0]) => {
    if (!isUnlocked(item)) return;
    const newId = `${item.id}-${Date.now()}`;
    const newPlaced: PlacedItem = {
      id: newId,
      itemId: item.id,
      x: 100 + Math.random() * 300,
      y: 80 + Math.random() * 200,
      scale: 1,
      rotation: 0,
    };
    setPlaced(prev => [...prev, newPlaced]);
    setSelectedId(newId);

    if (!givenXp.has(item.id)) {
      setGivenXp(prev => new Set(prev).add(item.id));
      addXp(item.xp);
      addToast(`${item.name} adicionado! +${item.xp} XP`, "achievement");
    }
  }, [achievements, givenXp, addXp, addToast]);

  // Mouse down on item - start drag
  const handlePointerDown = useCallback((e: React.PointerEvent, itemId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const item = placed.find(p => p.id === itemId);
    if (!item || !roomRef.current) return;

    setSelectedId(itemId);
    setDragId(itemId);
    isDragging.current = true;

    const roomRect = roomRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - roomRect.left - item.x,
      y: e.clientY - roomRect.top - item.y,
    });

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [placed]);

  // Mouse move - update position
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !dragId || !roomRef.current) return;
    e.preventDefault();

    const roomRect = roomRef.current.getBoundingClientRect();
    const newX = e.clientX - roomRect.left - dragOffset.x;
    const newY = e.clientY - roomRect.top - dragOffset.y;

    setPlaced(prev => prev.map(p =>
      p.id === dragId ? { ...p, x: newX, y: newY } : p
    ));
  }, [dragId, dragOffset]);

  // Mouse up - end drag
  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
    setDragId(null);
  }, []);

  const handleRemove = (id: string) => {
    setPlaced(prev => prev.filter(p => p.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleRotate = (id: string) => {
    setPlaced(prev => prev.map(p => p.id === id ? { ...p, rotation: (p.rotation + 30) % 360 } : p));
  };

  const handleScale = (id: string, dir: number) => {
    setPlaced(prev => prev.map(p => {
      if (p.id !== id) return p;
      return { ...p, scale: Math.max(0.4, Math.min(3, Math.round((p.scale + dir * 0.2) * 10) / 10)) };
    }));
  };

  const handleClear = () => {
    setPlaced([]);
    setSelectedId(null);
    setGivenXp(new Set());
  };

  const selectedPlaced = placed.find(p => p.id === selectedId);
  const selectedItemDef = selectedPlaced ? ITEMS.find(i => i.id === selectedPlaced.itemId) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1">🏠 Monte Seu Ambiente</h1>
        <p className="text-text-secondary mb-1">Arraste os itens pra onde quiser! Gire, aumente, diminua — é seu espaço.</p>
        <p className="text-xs text-text-secondary italic mb-4">Itens com 🔒 são desbloqueados por conquistas.</p>
      </motion.div>

      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className="text-sm text-text-secondary">
          {unlockedCount}/{ITEMS.length} desbloqueados · {placed.length} no ambiente
        </span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Palette size={14} className="text-text-secondary" />
            {THEMES.map(t => (
              <button key={t.id} onClick={() => setTheme(t.id)}
                className={`w-5 h-5 rounded-full border-2 transition ${theme === t.id ? "border-green-dark scale-110" : "border-border hover:scale-105"}`}
                style={{ backgroundColor: t.floor }} title={t.name}
              />
            ))}
          </div>
          {placed.length > 0 && (
            <button onClick={handleClear} className="px-3 py-1 rounded-lg text-xs text-text-secondary hover:text-terracotta transition">Limpar</button>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Item panel */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-card rounded-xl border border-border p-3">
            <h2 className="font-semibold text-text text-sm mb-2">Itens</h2>
            <div className="space-y-1 max-h-[60vh] overflow-y-auto pr-1">
              {ITEMS.map((item) => {
                const unlocked = isUnlocked(item);
                const alreadyPlaced = placedTypes.has(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => unlocked && !alreadyPlaced && handleAddItem(item)}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition ${
                      !unlocked ? "opacity-40 cursor-not-allowed" :
                      alreadyPlaced ? "bg-green-light/20" :
                      "hover:bg-border-light cursor-pointer active:scale-[0.97]"
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{unlocked ? item.emoji : "🔒"}</span>
                    <div className="min-w-0">
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
                        <p className="text-[10px] text-text-secondary">+{item.xp} XP</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Room */}
        <div className="flex-1 min-w-0">
          <div
            ref={roomRef}
            className="relative rounded-2xl border-2 overflow-hidden select-none touch-none"
            style={{
              borderColor: currentTheme.border,
              minHeight: 500,
              background: `linear-gradient(180deg, ${currentTheme.wall} 0%, ${currentTheme.wall} 55%, ${currentTheme.floor} 55%, ${currentTheme.floor} 100%)`,
            }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onClick={() => { if (!isDragging.current) setSelectedId(null); }}
          >
            {/* Floor line */}
            <div className="absolute left-0 right-0 top-[55%]" style={{ borderTop: `1px dashed ${currentTheme.border}` }} />

            {/* Room label */}
            <div className="absolute top-3 left-4 text-xs font-medium pointer-events-none" style={{ color: `${currentTheme.text}30` }}>
              Espaço de {name}
            </div>

            {/* Empty state */}
            {placed.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center" style={{ opacity: 0.2 }}>
                  <p className="text-5xl mb-3">🏠</p>
                  <p className="text-lg font-medium">Clique em um item para adicionar</p>
                  <p className="text-sm">Depois arraste pra onde quiser!</p>
                </div>
              </div>
            )}

            {/* Placed items */}
            {placed.map((p) => {
              const def = ITEMS.find(i => i.id === p.itemId);
              if (!def) return null;
              const isSelected = selectedId === p.id;
              const isBeingDragged = dragId === p.id;
              const emojiSize = def.size * p.scale;

              return (
                <div
                  key={p.id}
                  className="absolute"
                  style={{
                    left: p.x,
                    top: p.y,
                    transform: `translate(-50%, -50%) rotate(${p.rotation}deg)`,
                    zIndex: isBeingDragged ? 100 : isSelected ? 50 : 10,
                    cursor: isBeingDragged ? "grabbing" : "grab",
                  }}
                  onPointerDown={(e) => handlePointerDown(e, p.id)}
                  onClick={(e) => { e.stopPropagation(); if (!isDragging.current) setSelectedId(p.id); }}
                >
                  {/* Shadow */}
                  <div
                    className="absolute rounded-full blur-md"
                    style={{
                      width: emojiSize * 0.7,
                      height: emojiSize * 0.3,
                      left: "50%",
                      top: "80%",
                      transform: "translate(-50%, 0)",
                      background: "/black",
                      opacity: 0.08,
                    }}
                  />

                  {/* Item */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="relative flex items-center justify-center"
                    style={{
                      width: emojiSize,
                      height: emojiSize,
                    }}
                  >
                    {/* Selection ring */}
                    {isSelected && (
                      <div className="absolute inset-[-6px] rounded-xl border-2 border-green-dark pointer-events-none"
                        style={{ animation: "pulse-soft 2s ease-in-out infinite" }}
                      />
                    )}

                    <span className="select-none leading-none" style={{ fontSize: emojiSize * 0.7 }}>
                      {def.emoji}
                    </span>
                  </motion.div>

                  {/* Name label */}
                  {(isSelected || isBeingDragged) && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-0.5 rounded text-[10px] font-medium whitespace-nowrap pointer-events-none"
                      style={{ backgroundColor: currentTheme.wall, color: currentTheme.text, border: `1px solid ${currentTheme.border}` }}
                    >
                      {def.name}
                    </div>
                  )}

                  {/* Controls - show on selection */}
                  {isSelected && !isBeingDragged && (
                    <div
                      className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button onClick={() => handleRotate(p.id)} className="w-7 h-7 rounded-full bg-card shadow-md flex items-center justify-center hover:bg-border-light transition" title="Girar">
                        <RotateCw size={12} className="text-text" />
                      </button>
                      <button onClick={() => handleScale(p.id, 1)} className="w-7 h-7 rounded-full bg-card shadow-md flex items-center justify-center hover:bg-border-light transition" title="Aumentar">
                        <ZoomIn size={12} className="text-text" />
                      </button>
                      <button onClick={() => handleScale(p.id, -1)} className="w-7 h-7 rounded-full bg-card shadow-md flex items-center justify-center hover:bg-border-light transition" title="Diminuir">
                        <ZoomOut size={12} className="text-text" />
                      </button>
                      <button onClick={() => setTipItem(p.id)} className="w-7 h-7 rounded-full bg-card shadow-md flex items-center justify-center hover:bg-border-light transition" title="Dica">
                        <Info size={12} className="text-text" />
                      </button>
                      <button onClick={() => handleRemove(p.id)} className="w-7 h-7 rounded-full bg-terracotta shadow-md flex items-center justify-center hover:bg-terracotta-light transition" title="Remover">
                        <Trash2 size={12} className="text-white" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Tip modal */}
            <AnimatePresence>
              {tipItem && (() => {
                const p = placed.find(i => i.id === tipItem);
                const def = p ? ITEMS.find(i => i.id === p.itemId) : null;
                if (!def) return null;
                return (
                  <motion.div
                    key="tip"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[200] flex items-center justify-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                    onClick={() => setTipItem(null)}
                  >
                    <motion.div
                      initial={{ scale: 0.85 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.85 }}
                      className="bg-card rounded-2xl shadow-xl p-6 max-w-xs text-center"
                      onClick={e => e.stopPropagation()}
                    >
                      <span className="text-5xl">{def.emoji}</span>
                      <h3 className="font-bold text-text mt-3 text-lg">{def.name}</h3>
                      <p className="text-sm text-text-secondary mt-2 leading-relaxed">{def.tip}</p>
                      <button onClick={() => setTipItem(null)} className="mt-5 px-6 py-2.5 rounded-xl bg-green-dark text-white text-sm font-medium hover:bg-green transition">
                        Entendi
                      </button>
                    </motion.div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>

          {/* Selected item info bar */}
          <AnimatePresence>
            {selectedItemDef && !dragId && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-green-light/20 rounded-xl p-3 mt-3"
              >
                <p className="text-sm text-green-dark">
                  <span className="font-medium">{selectedItemDef.emoji} {selectedItemDef.name}</span>
                  <span className="text-text-secondary"> — Arraste pra mover · Botões: girar, aumentar, diminuir, dica, remover</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Unlock guide */}
      <div className="bg-card rounded-xl border border-border p-5 mt-6">
        <h2 className="font-semibold text-text mb-3 flex items-center gap-2">
          <Sparkles size={16} className="text-terracotta" /> Como desbloquear mais itens
        </h2>
        {ITEMS.filter(item => item.achievement && !isUnlocked(item)).length > 0 ? (
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
          </div>
        ) : (
          <p className="text-green-dark font-medium text-center py-2">🎉 Todos os itens estão desbloqueados!</p>
        )}
      </div>
    </div>
  );
}
