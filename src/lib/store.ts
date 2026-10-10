import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
}

export interface HydrationRecord {
  id: string;
  amountMl: number;
  timestamp: string;
}

export interface SleepRecord {
  id: string;
  date: string;
  sleepTime: string;
  wakeTime: string;
  durationMinutes: number;
  timestamp: string;
}

export interface MovementRecord {
  id: string;
  type: string;
  durationMinutes: number;
  date: string;
  timestamp: string;
}

export interface FocusRecord {
  id: string;
  durationMinutes: number;
  completed: boolean;
  timestamp: string;
}

export interface CheckinResponse {
  questionId: string;
  answer: string;
  value: number;
}

export interface CheckinResult {
  categories: Record<string, number>;
  positives: string[];
  intermediates: string[];
  attention: string[];
}

export interface CheckinRecord {
  id: string;
  responses: CheckinResponse[];
  result: CheckinResult;
  timestamp: string;
}

export interface QuizAnswer {
  questionIndex: number;
  selectedAnswer: number;
  correct: boolean;
}

export interface QuizRecord {
  id: string;
  category: string;
  difficulty: string;
  score: number;
  total: number;
  answers: QuizAnswer[];
  timestamp: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  xp: number;
  category: string;
  secret?: boolean;
}

export interface EquiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  actions?: { label: string; route: string }[];
  timestamp: string;
}

// XP levels
export function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function getLevelFromXp(xp: number): { level: number; currentXp: number; nextLevelXp: number } {
  let level = 1;
  let totalNeeded = 0;
  while (totalNeeded + xpForLevel(level) <= xp) {
    totalNeeded += xpForLevel(level);
    level++;
  }
  return { level, currentXp: xp - totalNeeded, nextLevelXp: xpForLevel(level) };
}

// Generate unique IDs
function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Achievements definition
export const ACHIEVEMENTS_DEF = [
  { id: "first_step", title: "Primeiro Passo", description: "Crie seu perfil", icon: "👋", xp: 10, category: "geral" },
  { id: "active_mind", title: "Mente Ativa", description: "Complete um quiz", icon: "🧠", xp: 50, category: "conhecimento" },
  { id: "focused", title: "Focado", description: "Complete um Pomodoro", icon: "🎯", xp: 30, category: "foco" },
  { id: "concentrated", title: "Concentrado", description: "Complete cinco Pomodoros", icon: "🏆", xp: 100, category: "foco" },
  { id: "ergonomics", title: "Ergonomia", description: "Complete o desafio de ergonomia", icon: "🪑", xp: 40, category: "exploração" },
  { id: "curious", title: "Curioso", description: "Explore conteúdos educativos", icon: "📖", xp: 30, category: "exploração" },
  { id: "hello_equi", title: "Olá, EQUI!", description: "Converse com o assistente", icon: "💬", xp: 20, category: "geral" },
  { id: "first_checkin", title: "Primeiro Check-in", description: "Complete seu primeiro check-in", icon: "✨", xp: 25, category: "geral" },
  { id: "self_knowledge", title: "Autoconhecimento", description: "Realize check-ins em três dias diferentes", icon: "🌟", xp: 60, category: "geral" },
  { id: "perfect_quiz", title: "Perfeito!", description: "Acerte 10/10 em um quiz", icon: "💯", xp: 100, category: "conhecimento" },
  { id: "secret_1", title: "???", description: "Conquista secreta", icon: "🔮", xp: 75, category: "secreta", secret: true },
];

interface AppState {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  updateUserName: (name: string) => void;
  updateUserAvatar: (url: string | null) => void;
  clearUser: () => void;

  // Hydration
  hydrationRecords: HydrationRecord[];
  addHydration: (amountMl: number) => void;
  editHydration: (id: string, amountMl: number) => void;
  deleteHydration: (id: string) => void;

  // Sleep
  sleepRecords: SleepRecord[];
  addSleep: (record: Omit<SleepRecord, "id" | "timestamp">) => void;
  editSleep: (id: string, record: Omit<SleepRecord, "id" | "timestamp">) => void;
  deleteSleep: (id: string) => void;

  // Movement
  movementRecords: MovementRecord[];
  addMovement: (record: Omit<MovementRecord, "id" | "timestamp">) => void;
  deleteMovement: (id: string) => void;

  // Focus
  focusRecords: FocusRecord[];
  addFocus: (durationMinutes: number) => void;

  // Check-in
  checkinRecords: CheckinRecord[];
  addCheckin: (responses: CheckinResponse[], result: CheckinResult) => void;
  deleteCheckin: (id: string) => void;

  // Quiz
  quizRecords: QuizRecord[];
  addQuiz: (record: Omit<QuizRecord, "id" | "timestamp">) => void;

  // XP & Achievements
  xp: number;
  achievements: Achievement[];
  addXp: (amount: number) => void;
  unlockAchievement: (id: string) => void;
  hasAchievement: (id: string) => boolean;

  // Settings
  fontSize: "small" | "normal" | "large";
  highContrast: boolean;
  reduceAnimations: boolean;
  underlineLinks: boolean;
  soundEnabled: boolean;
  darkMode: boolean;
  pomodoroFocusMinutes: number;
  pomodoroBreakMinutes: number;
  pomodoroLongBreakMinutes: number;
  setFontSize: (s: "small" | "normal" | "large") => void;
  setHighContrast: (v: boolean) => void;
  setReduceAnimations: (v: boolean) => void;
  setUnderlineLinks: (v: boolean) => void;
  setSoundEnabled: (v: boolean) => void;
  setDarkMode: (v: boolean) => void;
  setPomodoroFocusMinutes: (v: number) => void;
  setPomodoroBreakMinutes: (v: number) => void;
  setPomodoroLongBreakMinutes: (v: number) => void;

  // EQUI
  equiMessages: EquiMessage[];
  addEquiMessage: (msg: Omit<EquiMessage, "id" | "timestamp">) => void;
  clearEqui: () => void;

  // Content explored
  contentExplored: number;
  markContentExplored: () => void;

  // Ergonomics
  ergonomicsCompleted: boolean;
  setErgonomicsCompleted: () => void;

  // Toast
  toasts: { id: string; message: string; type: "success" | "error" | "info" | "achievement" }[];
  addToast: (message: string, type?: "success" | "error" | "info" | "achievement") => void;
  removeToast: (id: string) => void;

  // Demo mode
  isDemoMode: boolean;
  setDemoMode: (v: boolean) => void;
  resetAllData: () => void;

  // Active page for EQUI context
  activePage: string;
  setActivePage: (page: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      user: null,
      setUser: (user) => {
        set({ user });
        const state = get();
        if (!state.hasAchievement("first_step")) {
          state.unlockAchievement("first_step");
        }
      },
      updateUserName: (name) => {
        const user = get().user;
        if (user) set({ user: { ...user, name } });
      },
      updateUserAvatar: (url) => {
        const user = get().user;
        if (user) set({ user: { ...user, avatarUrl: url } });
      },
      clearUser: () => set({ user: null }),

      // Hydration
      hydrationRecords: [],
      addHydration: (amountMl) => {
        set((s) => ({
          hydrationRecords: [...s.hydrationRecords, { id: uid(), amountMl, timestamp: new Date().toISOString() }],
        }));
        get().addToast("Registro adicionado.", "success");
      },
      editHydration: (id, amountMl) => {
        set((s) => ({
          hydrationRecords: s.hydrationRecords.map((r) => (r.id === id ? { ...r, amountMl } : r)),
        }));
        get().addToast("Registro atualizado.", "success");
      },
      deleteHydration: (id) => {
        set((s) => ({ hydrationRecords: s.hydrationRecords.filter((r) => r.id !== id) }));
        get().addToast("Registro removido.", "info");
      },

      // Sleep
      sleepRecords: [],
      addSleep: (record) => {
        set((s) => ({
          sleepRecords: [...s.sleepRecords, { ...record, id: uid(), timestamp: new Date().toISOString() }],
        }));
        get().addToast("Registro de sono salvo.", "success");
      },
      editSleep: (id, record) => {
        set((s) => ({
          sleepRecords: s.sleepRecords.map((r) => (r.id === id ? { ...r, ...record } : r)),
        }));
        get().addToast("Registro atualizado.", "success");
      },
      deleteSleep: (id) => {
        set((s) => ({ sleepRecords: s.sleepRecords.filter((r) => r.id !== id) }));
        get().addToast("Registro removido.", "info");
      },

      // Movement
      movementRecords: [],
      addMovement: (record) => {
        set((s) => ({
          movementRecords: [...s.movementRecords, { ...record, id: uid(), timestamp: new Date().toISOString() }],
        }));
        get().addToast("Movimento registrado.", "success");
      },
      deleteMovement: (id) => {
        set((s) => ({ movementRecords: s.movementRecords.filter((r) => r.id !== id) }));
        get().addToast("Registro removido.", "info");
      },

      // Focus
      focusRecords: [],
      addFocus: (durationMinutes) => {
        set((s) => ({
          focusRecords: [...s.focusRecords, { id: uid(), durationMinutes, completed: true, timestamp: new Date().toISOString() }],
        }));
        get().addXp(20);
        get().addToast("Período de foco concluído! +20 XP", "achievement");

        const totalCompleted = get().focusRecords.filter((r) => r.completed).length;
        if (totalCompleted === 1 && !get().hasAchievement("focused")) {
          get().unlockAchievement("focused");
        }
        if (totalCompleted >= 5 && !get().hasAchievement("concentrated")) {
          get().unlockAchievement("concentrated");
        }
      },

      // Check-in
      checkinRecords: [],
      addCheckin: (responses, result) => {
        set((s) => ({
          checkinRecords: [...s.checkinRecords, { id: uid(), responses, result, timestamp: new Date().toISOString() }],
        }));
        if (!get().hasAchievement("first_checkin")) {
          get().unlockAchievement("first_checkin");
        }
        // Check for 3 different days
        const records = get().checkinRecords;
        const uniqueDays = new Set(records.map((r) => new Date(r.timestamp).toDateString()));
        if (uniqueDays.size >= 3 && !get().hasAchievement("self_knowledge")) {
          get().unlockAchievement("self_knowledge");
        }
        get().addToast("Check-in concluído.", "success");
      },
      deleteCheckin: (id) => {
        set((s) => ({ checkinRecords: s.checkinRecords.filter((r) => r.id !== id) }));
        get().addToast("Check-in removido.", "info");
      },

      // Quiz
      quizRecords: [],
      addQuiz: (record) => {
        const fullRecord = { ...record, id: uid(), timestamp: new Date().toISOString() };
        set((s) => ({ quizRecords: [...s.quizRecords, fullRecord] }));
        const xpAmount = Math.round((record.score / record.total) * 50);
        get().addXp(xpAmount);
        get().addToast(`Quiz concluído! +${xpAmount} XP`, "achievement");

        if (!get().hasAchievement("active_mind")) {
          get().unlockAchievement("active_mind");
        }
        if (record.score === record.total && record.total === 10 && !get().hasAchievement("perfect_quiz")) {
          get().unlockAchievement("perfect_quiz");
        }
      },

      // XP & Achievements
      xp: 0,
      achievements: [],
      addXp: (amount) => set((s) => ({ xp: s.xp + amount })),
      unlockAchievement: (id) => {
        const state = get();
        if (state.achievements.find((a) => a.id === id)) return;
        const def = ACHIEVEMENTS_DEF.find((a) => a.id === id);
        if (!def) return;
        const achievement: Achievement = { ...def, unlockedAt: new Date().toISOString() };
        set((s) => ({
          achievements: [...s.achievements, achievement],
          xp: s.xp + def.xp,
        }));
        get().addToast(`Conquista desbloqueada: ${def.title}! +${def.xp} XP`, "achievement");
      },
      hasAchievement: (id) => get().achievements.some((a) => a.id === id),

      // Settings
      fontSize: "normal",
      highContrast: false,
      reduceAnimations: false,
      underlineLinks: false,
      soundEnabled: true,
      darkMode: false,
      pomodoroFocusMinutes: 25,
      pomodoroBreakMinutes: 5,
      pomodoroLongBreakMinutes: 15,
      setFontSize: (s) => set({ fontSize: s }),
      setHighContrast: (v) => set({ highContrast: v }),
      setReduceAnimations: (v) => set({ reduceAnimations: v }),
      setUnderlineLinks: (v) => set({ underlineLinks: v }),
      setSoundEnabled: (v) => set({ soundEnabled: v }),
      setDarkMode: (v) => set({ darkMode: v }),
      setPomodoroFocusMinutes: (v) => set({ pomodoroFocusMinutes: v }),
      setPomodoroBreakMinutes: (v) => set({ pomodoroBreakMinutes: v }),
      setPomodoroLongBreakMinutes: (v) => set({ pomodoroLongBreakMinutes: v }),

      // EQUI
      equiMessages: [],
      addEquiMessage: (msg) => {
        set((s) => ({ equiMessages: [...s.equiMessages, { ...msg, id: uid(), timestamp: new Date().toISOString() }] }));
        if (msg.role === "user" && !get().hasAchievement("hello_equi")) {
          get().unlockAchievement("hello_equi");
        }
      },
      clearEqui: () => set({ equiMessages: [] }),

      // Content
      contentExplored: 0,
      markContentExplored: () => {
        set((s) => ({ contentExplored: s.contentExplored + 1 }));
        if (get().contentExplored >= 3 && !get().hasAchievement("curious")) {
          get().unlockAchievement("curious");
        }
      },

      // Ergonomics
      ergonomicsCompleted: false,
      setErgonomicsCompleted: () => {
        set({ ergonomicsCompleted: true });
        get().addXp(40);
        if (!get().hasAchievement("ergonomics")) {
          get().unlockAchievement("ergonomics");
        }
        get().addToast("Desafio de ergonomia concluído! +40 XP", "achievement");
      },

      // Toasts
      toasts: [],
      addToast: (message, type = "info") => {
        const id = uid();
        set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
        setTimeout(() => get().removeToast(id), 4000);
      },
      removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

      // Demo
      isDemoMode: false,
      setDemoMode: (v) => set({ isDemoMode: v }),
      resetAllData: () => {
        set({
          user: null,
          hydrationRecords: [],
          sleepRecords: [],
          movementRecords: [],
          focusRecords: [],
          checkinRecords: [],
          quizRecords: [],
          xp: 0,
          achievements: [],
          equiMessages: [],
          contentExplored: 0,
          ergonomicsCompleted: false,
          toasts: [],
        });
      },

      // Active page
      activePage: "home",
      setActivePage: (page) => set({ activePage: page }),
    }),
    {
      name: "equilibrio-storage",
      partialize: (state) => ({
        user: state.user,
        hydrationRecords: state.hydrationRecords,
        sleepRecords: state.sleepRecords,
        movementRecords: state.movementRecords,
        focusRecords: state.focusRecords,
        checkinRecords: state.checkinRecords,
        quizRecords: state.quizRecords,
        xp: state.xp,
        achievements: state.achievements,
        fontSize: state.fontSize,
        highContrast: state.highContrast,
        reduceAnimations: state.reduceAnimations,
        underlineLinks: state.underlineLinks,
        soundEnabled: state.soundEnabled,
        darkMode: state.darkMode,
        pomodoroFocusMinutes: state.pomodoroFocusMinutes,
        pomodoroBreakMinutes: state.pomodoroBreakMinutes,
        pomodoroLongBreakMinutes: state.pomodoroLongBreakMinutes,
        equiMessages: state.equiMessages,
        contentExplored: state.contentExplored,
        ergonomicsCompleted: state.ergonomicsCompleted,
        isDemoMode: state.isDemoMode,
      }),
    }
  )
);
