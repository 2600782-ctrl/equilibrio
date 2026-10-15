"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, LayoutDashboard, Droplets, Moon, Activity, Target, Laptop, Wind,
  BookOpen, ClipboardCheck, MessageCircle, Brain, Trophy, Gamepad2,
  User, Settings, Accessibility, Shield, LogOut, ChevronDown, Menu,
  X, Star, Sparkles
} from "lucide-react";
import { useAppStore, getLevelFromXp } from "@/lib/store";
import { getEquiResponse, getEquiSuggestions, getInitialGreeting } from "@/lib/equi";

// ─── Toast Provider ───
export function ToastProvider() {
  const toasts = useAppStore((s) => s.toasts);
  const removeToast = useAppStore((s) => s.removeToast);

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 360 }}>
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className={`pointer-events-auto rounded-xl px-4 py-3 shadow-lg text-sm font-medium flex items-center gap-2 ${
              t.type === "success" ? "bg-green-dark text-white" :
              t.type === "error" ? "bg-terracotta text-white" :
              t.type === "achievement" ? "bg-terracotta text-white" :
              "bg-text text-white"
            }`}
          >
            {t.type === "achievement" && <Sparkles size={16} />}
            {t.type === "success" && <Star size={14} />}
            {t.message}
            <button onClick={() => removeToast(t.id)} className="ml-1 opacity-70 hover:opacity-100"><X size={14} /></button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Onboarding Modal ───
export function OnboardingModal() {
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [step, setStep] = useState<"name" | "photo" | "done">("name");
  const fileRef = useRef<HTMLInputElement>(null);

  if (user) return null;

  const handleStart = () => {
    if (!name.trim()) return;
    setUser({
      id: Date.now().toString(36),
      name: name.trim(),
      avatarUrl,
      createdAt: new Date().toISOString(),
    });
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result as string;
      // Compress: create a canvas and resize
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 200;
        let w = img.width, h = img.height;
        if (w > h) { h = (h / w) * MAX; w = MAX; }
        else { w = (w / h) * MAX; h = MAX; }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d")?.drawImage(img, 0, 0, w, h);
        setAvatarUrl(canvas.toDataURL("image/jpeg", 0.8));
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] bg-background/95 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-2xl shadow-xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-dark mb-2">EQUILÍBRIO</h1>
          <p className="text-text-secondary">Saúde, tecnologia e bem-estar.</p>
        </div>

        {step === "name" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-lg text-center mb-2 font-medium">Bem-vindo.</p>
            <p className="text-text-secondary text-center mb-6">Antes de começar, como podemos te chamar?</p>
            <label className="block text-sm font-medium text-text-secondary mb-1">Nome ou apelido</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep("photo")}
              placeholder="Seu nome..."
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-text focus:ring-2 focus:ring-green outline-none mb-4"
              autoFocus
            />
            <button
              onClick={() => name.trim() && setStep("photo")}
              disabled={!name.trim()}
              className="w-full py-3 rounded-xl bg-green-dark text-white font-medium hover:bg-green transition disabled:opacity-50"
            >
              Continuar
            </button>
          </motion.div>
        )}

        {step === "photo" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-lg text-center mb-6 font-medium">Quer adicionar uma foto de perfil?</p>
            <div className="flex justify-center mb-6">
              <div className="relative w-28 h-28 rounded-full bg-background border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-text-secondary" />
                )}
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhotoSelect} className="hidden" />
            <div className="flex flex-col gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full py-3 rounded-xl border border-border bg-background text-text font-medium hover:bg-border-light transition"
              >
                {avatarUrl ? "Trocar foto" : "Adicionar foto"}
              </button>
              {avatarUrl && (
                <button onClick={() => setAvatarUrl(null)} className="w-full py-2 rounded-xl text-text-secondary text-sm hover:text-terracotta transition">
                  Remover foto
                </button>
              )}
              <button
                onClick={handleStart}
                className="w-full py-3 rounded-xl bg-green-dark text-white font-medium hover:bg-green transition mt-2"
              >
                Começar
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Avatar Component ───
export function Avatar({ name, url, size = 36 }: { name: string; url: string | null; size?: number }) {
  if (url) {
    return <img src={url} alt={name} className="rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  const initial = name.charAt(0).toUpperCase();
  return (
    <div
      className="rounded-full bg-green-light text-green-dark font-semibold flex items-center justify-center"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  );
}

// ─── Header ───
const TOOLS = [
  { href: "/hidratacao", label: "Hidratação", icon: Droplets },
  { href: "/sono", label: "Sono", icon: Moon },
  { href: "/movimento", label: "Movimento", icon: Activity },
  { href: "/foco", label: "Foco", icon: Target },
  { href: "/ergonomia", label: "Ergonomia", icon: Laptop },
  { href: "/pausa-guiada", label: "Pausa Guiada", icon: Wind },
];

const NAV_ITEMS = [
  { href: "/", label: "Início", icon: Home },
  { href: "/dashboard", label: "Meu Bem-Estar", icon: LayoutDashboard },
  { href: "/aprender", label: "Aprender", icon: BookOpen },
  { href: "/checkin", label: "Check-in", icon: ClipboardCheck },
  { href: "/equi", label: "EQUI", icon: MessageCircle },
  { href: "/quiz", label: "Quiz", icon: Brain },
  { href: "/conquistas", label: "Conquistas", icon: Trophy },
  { href: "/jogo", label: "Jardim", icon: Gamepad2 },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const xp = useAppStore((s) => s.xp);
  const clearUser = useAppStore((s) => s.clearUser);
  const resetAllData = useAppStore((s) => s.resetAllData);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { level } = getLevelFromXp(xp);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-50 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl text-green-dark whitespace-nowrap">
            EQUILÍBRIO
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-8">
            <Link href="/" className={`px-3 py-2 rounded-lg text-sm font-medium transition ${isActive("/") && pathname === "/" ? "bg-green-light text-green-dark" : "text-text-secondary hover:bg-border-light hover:text-text"}`}>
              Início
            </Link>
            <Link href="/dashboard" className={`px-3 py-2 rounded-lg text-sm font-medium transition ${isActive("/dashboard") ? "bg-green-light text-green-dark" : "text-text-secondary hover:bg-border-light hover:text-text"}`}>
              Meu Bem-Estar
            </Link>

            {/* Tools dropdown */}
            <div className="relative">
              <button
                onClick={() => { setToolsOpen(!toolsOpen); setProfileOpen(false); }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 ${TOOLS.some(t => isActive(t.href)) ? "bg-green-light text-green-dark" : "text-text-secondary hover:bg-border-light hover:text-text"}`}
              >
                Ferramentas <ChevronDown size={14} className={`transition ${toolsOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {toolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute top-full left-0 mt-1 bg-card rounded-xl shadow-lg border border-border py-2 w-56"
                  >
                    {TOOLS.map((t) => (
                      <Link
                        key={t.href}
                        href={t.href}
                        onClick={() => setToolsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition ${isActive(t.href) ? "bg-green-light text-green-dark" : "text-text hover:bg-border-light"}`}
                      >
                        <t.icon size={16} /> {t.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {NAV_ITEMS.filter(n => !["/", "/dashboard"].includes(n.href)).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${isActive(item.href) ? "bg-green-light text-green-dark" : "text-text-secondary hover:bg-border-light hover:text-text"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {user && (
              <>
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-beige text-green-dark text-xs font-semibold">
                  <Star size={12} /> Nível {level}
                </div>
                <div className="relative">
                  <button
                    onClick={() => { setProfileOpen(!profileOpen); setToolsOpen(false); }}
                    className="flex items-center gap-2 hover:opacity-80 transition"
                  >
                    <Avatar name={user.name} url={user.avatarUrl} size={32} />
                    <span className="hidden md:block text-sm font-medium text-text max-w-[100px] truncate">{user.name}</span>
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute top-full right-0 mt-1 bg-card rounded-xl shadow-lg border border-border py-2 w-56"
                      >
                        <div className="px-4 py-3 border-b border-border">
                          <div className="flex items-center gap-3">
                            <Avatar name={user.name} url={user.avatarUrl} size={40} />
                            <div>
                              <p className="font-medium text-text">{user.name}</p>
                              <p className="text-xs text-text-secondary">Nível {level}</p>
                            </div>
                          </div>
                        </div>
                        {[
                          { href: "/perfil", label: "Meu Perfil", icon: User },
                          { href: "/conquistas", label: "Conquistas", icon: Trophy },
                          { href: "/configuracoes", label: "Configurações", icon: Settings },
                          { href: "/acessibilidade", label: "Acessibilidade", icon: Accessibility },
                          { href: "/privacidade", label: "Privacidade/Dados", icon: Shield },
                        ].map((item) => (
                          <Link key={item.href} href={item.href} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-text hover:bg-border-light transition">
                            <item.icon size={16} /> {item.label}
                          </Link>
                        ))}
                        <div className="border-t border-border mt-1 pt-1">
                          <button
                            onClick={() => { resetAllData(); setProfileOpen(false); }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-terracotta hover:bg-border-light transition w-full text-left"
                          >
                            <LogOut size={16} /> Redefinir perfil
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-border-light transition"
              aria-label="Abrir menu"
            >
              <Menu size={24} className="text-text" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/30"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-[61] w-72 bg-card shadow-xl flex flex-col"
            >
              <div className="flex items-center justify-between px-4 h-16 border-b border-border">
                <span className="font-bold text-lg text-green-dark">EQUILÍBRIO</span>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-border-light"><X size={20} /></button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4">
                <Link href="/" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-6 py-3 text-sm font-medium ${pathname === "/" ? "bg-green-light text-green-dark" : "text-text"}`}>
                  <Home size={18} /> Início
                </Link>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className={`flex items-center gap&3 px-6 py-3 text-sm font-medium ${isActive("/dashboard") ? "bg-green-light text-green-dark" : "text-text"}`}>
                  <LayoutDashboard size={18} /> Meu Bem-Estar
                </Link>
                <p className="px-6 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider mt-4">Ferramentas</p>
                {TOOLS.map((t) => (
                  <Link key={t.href} href={t.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-6 py-3 text-sm ${isActive(t.href) ? "bg-green-light text-green-dark" : "text-text"}`}>
                    <t.icon size={18} /> {t.label}
                  </Link>
                ))}
                <p className="px-6 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider mt-4">Mais</p>
                {NAV_ITEMS.filter(n => !["/", "/dashboard"].includes(n.href)).map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-6 py-3 text-sm ${isActive(item.href) ? "bg-green-light text-green-dark" : "text-text"}`}>
                    <item.icon size={18} /> {item.label}
                  </Link>
                ))}
              </nav>
              {user && (
                <div className="border-t border-border p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} url={user.avatarUrl} size={36} />
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-text-secondary">Nível {level}</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Footer ───
export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-bold text-lg text-green-dark mb-2">EQUILÍBRIO</p>
            <p className="text-sm text-text-secondary">Saúde, tecnologia e bem-estar.</p>
          </div>
          <div>
            <p className="font-semibold text-sm text-text mb-3">Navegação</p>
            <div className="flex flex-col gap-1.5">
              {[
                { href: "/", label: "Início" },
                { href: "/sobre", label: "Sobre" },
                { href: "/fontes", label: "Fontes e Referências" },
                { href: "/acessibilidade", label: "Acessibilidade" },
                { href: "/privacidade", label: "Privacidade" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="text-sm text-text-secondary hover:text-green-dark transition">{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm text-text mb-2">EXPOTEC 2026</p>
            <p className="text-sm text-text-secondary mb-4">Curso Técnico em Informática</p>
            <p className="text-xs text-text-secondary italic">O Equilíbrio possui finalidade educativa e informativa. Não realiza diagnósticos e não substitui acompanhamento de profissionais de saúde.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── EQUI Floating Widget ───
export function EquiFloating() {
  const user = useAppStore((s) => s.user);
  const equiMessages = useAppStore((s) => s.equiMessages);
  const addEquiMessage = useAppStore((s) => s.addEquiMessage);
  const clearEqui = useAppStore((s) => s.clearEqui);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [equiMessages]);

  useEffect(() => {
    if (isOpen && user && !initialized && equiMessages.length === 0) {
      const greeting = getInitialGreeting(user.name);
      addEquiMessage({ role: "assistant", content: greeting.content, actions: greeting.actions });
      setInitialized(true);
    }
  }, [isOpen, user, initialized, equiMessages.length]);

  if (!user) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setInput("");
    addEquiMessage({ role: "user", content: msg });
    const response = getEquiResponse(msg, pathname, user.name);
    setTimeout(() => {
      addEquiMessage({ role: "assistant", content: response.content, actions: response.actions });
    }, 400);
  };

  const suggestions = getEquiSuggestions(user.name, pathname);

  return (
    <>
      {/* Floating button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[80] w-14 h-14 rounded-full bg-green-dark text-white shadow-lg flex items-center justify-center hover:bg-green transition"
        aria-label={isOpen ? "Fechar EQUI" : "Abrir EQUI"}
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 z-[80] w-[360px] max-w-[calc(100vw-2rem)] bg-card rounded-2xl shadow-xl border border-border flex flex-col overflow-hidden"
            style={{ maxHeight: "min(500px, calc(100vh - 140px))" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-green-dark text-white rounded-t-2xl">
              <div className="flex items-center gap-2">
                <MessageCircle size={18} />
                <span className="font-semibold text-sm">EQUI</span>
              </div>
              <div className="flex items-center gap-1">
                <Link href="/equi" onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/20 transition text-xs">
                  Expandir
                </Link>
                <button onClick={() => { clearEqui(); setInitialized(false); }} className="p-1.5 rounded-lg hover:bg-white/20 transition" title="Limpar conversa">
                  <Wind size={14} />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg hover:bg-white/20 transition">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1+ overflow-y-auto p-4 space-y-3" style={{ maxHeight: 320 }}>
              {equiMessages.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-text-secondary mb-3">Como posso ajudar?</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => { router.push(s.route); setIsOpen(false); }}
                        className="px-3 py-1.5 rounded-lg bg-border-light text-text text-xs hover:bg-border transition"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {equiMessages.map((m) => (
                <div key={m.id} className={`${m.role === "user" ? "text-right" : "text-left"}`}>
                  <div className={`inline-block px-3 py-2 rounded-xl text-sm max-w-[85%] ${
                    m.role === "user" ? "bg-green-dark text-white" : "bg-border-light text-text"
                  }`}>
                    {m.content.split("\n").map((line, i) => (
                      <p key={i} className={i > 0 ? "mt-1" : ""}>{line}</p>
                    ))}
                  </div>
                  {m.actions && m.actions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {m.actions.map((a, i) => (
                        <button
                          key={i}
                          onClick={() => { router.push(a.route); setIsOpen(false); }}
                          className="px-2.5 py-1 rounded-lg bg-green-light text-green-dark text-xs font-medium hover:bg-green hover:text-white transition"
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Suggestions when empty */}
            {equiMessages.length > 0 && equiMessages[equiMessages.length - 1].role === "assistant" && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {suggestions.slice(0, 2).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => { router.push(s.route); setIsOpen(false); }}
                    className="px-2.5 py-1 rounded-lg bg-border-light text-text text-xs hover:bg-border transition"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 px-4 py-3 border-t border-border">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Pergunte ao EQUI..."
                className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-sm text-text focus:ring-2 focus:ring-green outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-green-dark text-white hover:bg-green transition disabled:opacity-50"
              >
                <Target size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Client Layout Wrapper ───
export function ClientLayout({ children }: { children: React.ReactNode }) {
  const fontSize = useAppStore((s) => s.fontSize);
  const darkMode = useAppStore((s) => s.darkMode);
  const highContrast = useAppStore((s) => s.highContrast);
  const reduceAnimations = useAppStore((s) => s.reduceAnimations);
  const underlineLinks = useAppStore((s) => s.underlineLinks);
  const user = useAppStore((s) => s.user);

  const fontSizeClass = fontSize === "large" ? "text-lg" : fontSize === "small" ? "text-sm" : "text-base";

  return (
    <div className={`${fontSizeClass} ${darkMode ? "dark" : ""} ${highContrast ? "high-contrast" : ""} ${underlineLinks ? "underline-links" : ""}`}>
      <div className={`min-h-screen flex flex-col ${darkMode ? "bg-[#1a1f1c] text-[#e0e5dc]" : "bg-background text-text"}`}>
        <OnboardingModal />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ToastProvider />
        {user && <EquiFloating />}
      </div>
    </div>
  );
}
