"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Lock, Check, Sparkles, Trophy, Info, RotateCcw } from "lucide-react";
import { useAppStore, ACHIEVEMENTS_DEF } from "@/lib/store";
import Link from "next/link";

// Room grid size
const GRID_COLS = 8;
const GRID_ROWS = 6;

// Item definitions - some locked behind achievements
interface RoomItemDef {
  id: string;
  name: string;
  emoji: string;
  width: number;
  height: number;
  category: string;
  tip: string;
  requiredAchievement: string | null;
  requiredLabel: string;
  xpReward: number;
}

const ROOM_ITEMS: RoomItemDef[] = [
  { id: "desk", name: "Mesa", emoji: "🪑", width: 3, height: 1, category: "mobília", tip: "A mesa deve ter altura que permita cotovelos em ~90°.", requiredAchievement: null, requiredLabel: "", xpReward: 5 },
  { id: "chair", name: "Cadeira", emoji: "💺", width: 2, height: 2, category: "mobília", tip: "Cadeira com suporte lombar. Pés apoiados no chão.", requiredAchievement: null, requiredLabel: "", xpReward: 5 },
  { id: "monitor", name: "Monitor", emoji: "🖥️", width: 2, height: 1, category: "tecnologia", tip: "Topo do monitor na altura dos olhos. Distância de um braço.", requiredAchievement: "first_step", requiredLabel: "Crie seu perfil", xpReward: 10 },
  { id: "keyboard", name: "Teclado", emoji: "⌨️", width: 2, height: 1, category: "tecnologia", tip: "Punhos retos ao digitar. Na mesma altura da mesa.", requiredAchievement: "focused", requiredLabel: "Complete um Pomodoro", xpReward: 10 },
  { id: "mouse", name: "Mouse", emoji: "🖱️", width: 1, height: 1, category: "tecnologia", tip: "Próximo ao teclado. Punho reto ao usar.", requiredAchievement: "focused", requiredLabel: "Complete um Pomodoro", xpReward: 10 },
  { id: "plant", name: "Planta", emoji: "🪴", width: 1, height: 1, category: "decoração", tip: "Plantas melhoram o humor e a qualidade do ar!", requiredAchievement: "curious", requiredLabel: "Explore 3 conteúdos", xpReward: 10 },
  { id: "lamp", name: "Luminária", emoji: "💡", width: 1, height: 1, category: "iluminação", tip: "Iluminação adequada reduz fadiga visual.", requiredAchievement: "hello_equi", requiredLabel: "Converse com o EQUI", xpReward: 10 },
  { id: "bookshelf", name: "Estante", emoji: "📚", width: 1, height: 2, category: "organização", tip: "Mantenha materiais frequentes ao alcance.", requiredAchievement: "active_mind", requiredLabel: "Complete um quiz", xpReward: 15 },
  { id: "window", name: "Janela", emoji: "🪟", width: 2, height: 1, category: "iluminação", tip: "Luz natural melhora o humor e o foco. Evite reflexos no monitor.", requiredAchievement: "first_checkin", requiredLabel: "Faça um check-in", xpReward: 15 },
  { id: "poster", name: "Quadro motivacional", emoji: "🖼️", width: 1, height: 1, category: "decoração", tip: "Um ambiente pessoal ajuda na motivação.", requiredAchievement: "ergonomics", requiredLabel: "Complete o desafio de ergonomia", xpReward: 15 },
  { id: "coffee", name: "Café", emoji: "☕", width: 1, height: 1, category: "conforto", tip: "Hidrate-se! Alterne café com água.", requiredAchievement: "self_knowledge", requiredLabel: "3 check-ins em dias diferentes", xpReward: 20 },
  { id: "yoga_mat", name: "Tapete de alongamento", emoji: "🧘", width: 2, height: 1, category: "movimento", tip: "Ter um espaço para alongamento incentiva pausas ativas.", requiredAchievement: "concentrated", requiredLabel: "Complete 5 Pomodoros", xpReward: 20 },
];

interface PlacedItem {
  id: string;
  itemId: string;
  row: number;
  col: number;
}

export default function MonteAmbientePage() {
  const user = useAppStore((s) => s.user);
  const achievements = useAppStore((s) => s.achievements);
  const xp = useAppStore((s) => s.xp);
  const addXp = useAppStore((s) => s.addXp);
  const addToast = useAppStore((s) => s.addToast);
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showTip, setShowTip] = useState<{ item: RoomItemDef; pos: { row: number; col: number } } | null>(null);
  const [placedTips, setPlacedTips] = useState<Set<string>>(new Set());

  const name = user?.name || "Visitante";
  const hasAchievement = (id: string) => achievements.some(a => a.id === id);

  const isItemUnlocked = (item: RoomItemDef) => {
    if (!item.requiredAchievement) return true;
    return hasAchievement(item.requiredAchievement);
  };

  const unlockedCount = ROOM_ITEMS.filter(i => isItemUnlocked(i)).length;
  const totalItems = ROOM_ITEMS.length;
  const placedCount = placedItems.length;

  // Check if a cell is occupied
  const isOccupied = (row: number, col: number) => {
    for (const placed of placedItems) {
      const def = ROOM_ITEMS.find(i => i.id === placed.itemId);
      if (!def) continue;
      if (row >= placed.row && row < placed.row + def.height &&
          col >= placed.col && col < placed.col + def.width) {
        return placed;
      }
    }
    return null;
  };

  // Check if item fits at position
  const canPlace = (item: RoomItemDef, row: number, col: number) => {
    if (row + item.height > GRID_ROWS || col + item.width > GRID_COLS) return false;
    for (let r = row; r < row + item.height; r++) {
      for (let c = col; c < col + item.width; c++) {
        if (isOccupied(r, c)) return false;
      }
    }
    return true;
  };

  // Place item
  const handlePlaceItem = (item: RoomItemDef, row: number, col: number) => {
    if (!canPlace(item, row, col)) return;
    if (!isItemUnlocked(item)) return;

    const newPlaced: PlacedItem = {
      id: `${item.id}-${Date.now()}`,
      itemId: item.id,
      row,
      col,
    };

    setPlacedItems(prev => [...prev, newPlaced]);
    setSelectedItem(null);
    setShowTip({ item, pos: { row, col } });

    // Give XP for first time placing this type
    const tipKey = item.id;
    if (!placedTips.has(tipKey)) {
      setPlacedTips(prev => new Set(prev).add(tipKey));
      addXp(item.xpReward);
      addToast(`${item.name} adicionado! +${item.xpReward} XP`, "achievement");
    } else {
      addToast(`${item.name} adicionado.`, "success");
    }
  };

  // Remove item
  const handleRemoveItem = (placedId: string) => {
    setPlacedItems(prev => prev.filter(p => p.id !== placedId));
  };

  // Clear all
  const handleClearAll = () => {
    setPlacedItems([]);
    setPlacedTips(new Set());
  };

  // Get unique placed item types
  const placedTypes = new Set(placedItems.map(p => p.itemId));

  // Calculate room score
  const roomScore = Math.min(100, Math.round((placedTypes.size / totalItems) * 100));

  // Ergonomic evaluation
  const getEvaluation = () => {
    const tips: string[] = [];
    const hasDesk = placedItems.some(p => p.itemId === "desk");
    const hasChair = placedItems.some(p => p.itemId === "chair");
    const hasMonitor = placedItems.some(p => p.itemId === "monitor");
    const hasKeyboard = placedItems.some(p => p.itemId === "keyboard");
    const hasLamp = placedItems.some(p => p.itemId === "lamp");
    const hasWindow = placedItems.some(p => p.itemId === "window");

    if (hasDesk && hasChair) tips.push("✓ Mesa e cadeira formam uma boa base de trabalho.");
    if (hasMonitor && hasDesk) tips.push("✓ Monitor sobre a mesa — posição adequada.");
    if (hasKeyboard && hasMonitor) tips.push("✓ Teclado e monitor configurados.");
    if (hasLamp || hasWindow) tips.push("✓ Boa iluminação no ambiente.");
    if (!hasDesk) tips.push("○ Adicione uma mesa para organizar seu espaço.");
    if (!hasChair) tips.push("○ Uma cadeira ergonômica é essencial.");
    if (!hasMonitor) tips.push("○ Um monitor na altura certa previne tensão cervical.");
    if (!hasLamp && !hasWindow) tips.push("○ Iluminação adequada é importante para os olhos.");
    if (placedItems.length === 0) tips.push("○ Seu ambiente está vazio. Comece adicionando os itens básicos!");

    return tips;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1 flex items-center gap-2">
          <Home className="text-green" /> Monte Seu Ambiente
        </h1>
        <p className="text-text-secondary mb-2">
          Organize seu espaço de trabalho. Itens são desbloqueados conforme você conquista conquistas!
        </p>
        <p className="text-xs text-text-secondary italic mb-6">
          Itens com 🔒 precisam de conquistas específicas — explore o site para desbloquear tudo!
        </p>
      </motion.div>

      {/* Progress bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="font-semibold text-text text-sm">Itens desbloqueados: {unlockedCount}/{totalItems}</span>
            <span className="text-text-secondary text-xs ml-3">Colocados: {placedCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-green-dark">{roomScore}%</span>
            {placedItems.length > 0 && (
              <button onClick={handleClearAll} className="p-1.5 rounded-lg text-text-secondary hover:text-terracotta hover:bg-border-light transition" title="Limpar ambiente">
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>
        <div className="w-full h-2.5 bg-border-light rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / totalItems) * 100}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-green-dark rounded-full"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items sidebar */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border p-4">
            <h2 className="font-semibold text-text mb-3 text-sm">Itens disponíveis</h2>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {ROOM_ITEMS.map((item) => {
                const unlocked = isItemUnlocked(item);
                const isPlaced = placedTypes.has(item.id);
                const isSelected = selectedItem === item.id;

                return (
                  <motion.button
                    key={item.id}
                    whileHover={unlocked ? { scale: 1.02 } : {}}
                    whileTap={unlocked ? { scale: 0.98 } : {}}
                    onClick={() => {
                      if (unlocked && !isPlaced) {
                        setSelectedItem(isSelected ? null : item.id);
                      }
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition text-sm ${
                      !unlocked ? "opacity-50 cursor-not-allowed" :
                      isPlaced ? "bg-green-light/30 cursor-default" :
                      isSelected ? "bg-green-dark text-white ring-2 ring-green" :
                      "hover:bg-border-light cursor-pointer"
                    }`}
                  >
                    <span className="text-xl flex-shrink-0">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      {!unlocked ? (
                        <p className="text-xs text-text-secondary flex items-center gap-1">
                          <Lock size={10} /> {item.requiredLabel}
                        </p>
                      ) : isPlaced ? (
                        <p className="text-xs text-green-dark flex items-center gap-1">
                          <Check size={10} /> Colocado
                        </p>
                      ) : isSelected ? (
                        <p className="text-xs opacity-80">Clique no ambiente para posicionar</p>
                      ) : (
                        <p className="text-xs text-text-secondary">{item.category} · +{item.xpReward} XP</p>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Room grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-text text-sm">Seu ambiente</h2>
              {selectedItem && (
                <span className="text-xs text-green-dark font-medium animate-pulse-soft">
                  Clique em uma posição para colocar {ROOM_ITEMS.find(i => i.id === selectedItem)?.name}
                </span>
              )}
            </div>

            {/* Room visualization */}
            <div className="relative bg-gradient-to-b from-blue-light/10 to-green-light/10 rounded-xl border border-border-light p-2 mb-4">
              {/* Room label */}
              <p className="text-xs text-text-secondary text-center mb-2">Ambiente de {name}</p>

              {/* Grid */}
              <div
                className="grid gap-1 relative"
                style={{
                  gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                  gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
                }}
              >
                {Array.from({ length: GRID_ROWS * GRID_COLS }, (_, idx) => {
                  const row = Math.floor(idx / GRID_COLS);
                  const col = idx % GRID_COLS;
                  const occupied = isOccupied(row, col);

                  return (
                    <div
                      key={idx}
                      className={`aspect-square rounded-lg border transition text-center flex items-center justify-center relative ${
                        occupied ? "border-transparent" :
                        selectedItem ? "border-dashed border-green/40 hover:bg-green-light/20 hover:border-green cursor-pointer" :
                        "border-border-light/50"
                      }`}
                      style={{ minHeight: 40 }}
                      onClick={() => {
                        if (selectedItem && !occupied) {
                          const item = ROOM_ITEMS.find(i => i.id === selectedItem);
                          if (item) handlePlaceItem(item, row, col);
                        }
                      }}
                    >
                      {/* Render placed items at their origin cell */}
                      {occupied && occupied.row === row && occupied.col === col && (() => {
                        const def = ROOM_ITEMS.find(i => i.id === occupied.itemId);
                        if (!def) return null;
                        return (
                          <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="absolute inset-0 flex items-center justify-center rounded-lg bg-card border border-green/30 shadow-sm cursor-pointer hover:ring-2 hover:ring-terracotta z-10"
                            style={{
                              gridColumn: `span ${def.width}`,
                              gridRow: `span ${def.height}`,
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveItem(occupied.id);
                            }}
                            title={`Clique para remover ${def.name}`}
                          >
                            <span className="text-lg">{def.emoji}</span>
                          </motion.div>
                        );
                      })()}
                    </div>
                  );
                })}
              </div>

              {/* Placed items overlay (for multi-cell items) */}
              <div className="absolute inset-0 pointer-events-none p-2">
                {placedItems.map((placed) => {
                  const def = ROOM_ITEMS.find(i => i.id === placed.itemId);
                  if (!def) return null;
                  // Calculate position as percentage
                  const left = (placed.col / GRID_COLS) * 100;
                  const top = (placed.row / GRID_ROWS) * 100;
                  const width = (def.width / GRID_COLS) * 100;
                  const height = (def.height / GRID_ROWS) * 100;

                  return (
                    <motion.div
                      key={placed.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="absolute flex items-center justify-center rounded-lg bg-card/90 border border-green/30 shadow-sm pointer-events-auto cursor-pointer hover:ring-2 hover:ring-terracotta z-10"
                      style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }}
                      onClick={() => {
                        setShowTip({ item: def, pos: { row: placed.row, col: placed.col } });
                      }}
                      title={`${def.name} — clique para dica, duplo-clique para remover`}
                      onDoubleClick={() => handleRemoveItem(placed.id)}
                    >
                      <span style={{ fontSize: Math.min(width * 0.8, height * 0.8, 32) }} className="select-none">{def.emoji}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Tip display */}
            <AnimatePresence>
              {showTip && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-green-light/30 rounded-xl p-3 mb-4 overflow-hidden"
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{showTip.item.emoji}</span>
                    <div className="flex-1">
                      <p className="font-medium text-green-dark text-sm">{showTip.item.name}</p>
                      <p className="text-xs text-text mt-0.5">{showTip.item.tip}</p>
                    </div>
                    <button onClick={() => setShowTip(null)} className="text-text-secondary hover:text-text text-xs">✕</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Evaluation */}
            <div className="border-t border-border pt-3">
              <h3 className="font-semibold text-text text-sm mb-2 flex items-center gap-1">
                <Info size={14} /> Avaliação do ambiente
              </h3>
              <div className="space-y-1">
                {getEvaluation().map((tip, i) => (
                  <p key={i} className={`text-xs ${tip.startsWith("✓") ? "text-green-dark" : tip.startsWith("○") ? "text-text-secondary" : "text-text"}`}>
                    {tip}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Unlock guide */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl border border-border p-5 mt-6">
        <h2 className="font-semibold text-text mb-3 flex items-center gap-2">
          <Trophy size={16} className="text-terracotta" /> Como desbloquear itens
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ROOM_ITEMS.filter(item => item.requiredAchievement).map((item) => {
            const unlocked = isItemUnlocked(item);
            const achDef = ACHIEVEMENTS_DEF.find(a => a.id === item.requiredAchievement);

            return (
              <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl ${unlocked ? "bg-green-light/30" : "bg-border-light/50"}`}>
                <span className="text-xl">{unlocked ? item.emoji : "🔒"}</span>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${unlocked ? "text-green-dark" : "text-text"}`}>{item.name}</p>
                  <p className="text-xs text-text-secondary">
                    {unlocked ? (
                      <span className="flex items-center gap-1"><Check size={10} className="text-green-dark" /> Desbloqueado</span>
                    ) : (
                      <span>{achDef?.icon} {item.requiredLabel}</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Disclaimer */}
      <p className="text-xs text-text-secondary text-center mt-6 italic">
        As dicas são baseadas em recomendações de ergonomia e não substituem avaliação profissional.
      </p>
    </div>
  );
}
