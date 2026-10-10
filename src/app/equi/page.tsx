"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send, Trash2, Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getEquiResponse, getEquiSuggestions, getInitialGreeting } from "@/lib/equi";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function EquiPage() {
  const user = useAppStore((s) => s.user);
  const equiMessages = useAppStore((s) => s.equiMessages);
  const addEquiMessage = useAppStore((s) => s.addEquiMessage);
  const clearEqui = useAppStore((s) => s.clearEqui);
  const [input, setInput] = useState("");
  const [initialized, setInitialized] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const name = user?.name || "Visitante";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [equiMessages]);

  useEffect(() => {
    if (!initialized && equiMessages.length === 0) {
      const greeting = getInitialGreeting(name);
      addEquiMessage({ role: "assistant", content: greeting.content, actions: greeting.actions });
      setInitialized(true);
    }
  }, [initialized, equiMessages.length, name]);

  const handleSend = () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setInput("");
    addEquiMessage({ role: "user", content: msg });
    setTimeout(() => {
      const response = getEquiResponse(msg, pathname, name);
      addEquiMessage({ role: "assistant", content: response.content, actions: response.actions });
    }, 400);
  };

  const suggestions = getEquiSuggestions(name, pathname);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1 flex items-center gap-2">
          <MessageCircle className="text-green" /> EQUI
        </h1>
        <p className="text-text-secondary mb-6">Assistente virtual do Equilíbrio — navegação, ajuda e informações sobre bem-estar.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border overflow-hidden flex flex-col" style={{ minHeight: 500 }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-green-dark text-white">
          <div className="flex items-center gap-2">
            <Sparkles size={18} />
            <span className="font-semibold">EQUI</span>
          </div>
          <button
            onClick={() => { clearEqui(); setInitialized(false); }}
            className="flex items-center gap-1 px-3 py-1 rounded-lg text-sm hover:bg-white/20 transition"
          >
            <Trash2 size={14} /> Limpar conversa
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ maxHeight: 500 }}>
          {equiMessages.length === 0 && (
            <div className="text-center py-12">
              <Sparkles size={40} className="text-green mx-auto mb-4" />
              <p className="text-text-secondary mb-4">Como posso ajudar?</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => router.push(s.route)}
                    className="px-4 py-2 rounded-xl bg-border-light text-text text-sm hover:bg-border transition"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {equiMessages.map((m) => (
            <div key={m.id} className={`${m.role === "user" ? "text-right" : "text-left"}`}>
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`inline-block px-4 py-3 rounded-2xl text-sm max-w-[80%] ${
                  m.role === "user"
                    ? "bg-green-dark text-white rounded-br-md"
                    : "bg-border-light text-text rounded-bl-md"
                }`}
              >
                {m.content.split("\n").map((line, i) => (
                  <p key={i} className={i > 0 ? "mt-1.5" : ""} style={{ whiteSpace: "pre-wrap" }}>{line}</p>
                ))}
              </motion.div>
              {m.actions && m.actions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {m.actions.map((a, i) => (
                    <Link
                      key={i}
                      href={a.route}
                      className="px-3 py-1.5 rounded-xl bg-green-light text-green-dark text-xs font-medium hover:bg-green hover:text-white transition"
                    >
                      {a.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestions */}
        {equiMessages.length > 0 && equiMessages[equiMessages.length - 1].role === "assistant" && (
          <div className="px-5 pb-2 flex flex-wrap gap-2">
            {suggestions.slice(0, 3).map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  addEquiMessage({ role: "user", content: s.label });
                  setTimeout(() => {
                    const response = getEquiResponse(s.label, pathname, name);
                    addEquiMessage({ role: "assistant", content: response.content, actions: response.actions });
                  }, 400);
                }}
                className="px-3 py-1.5 rounded-xl bg-border-light text-text text-xs hover:bg-border transition"
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex items-center gap-2 px-5 py-3 border-t border-border">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Pergunte ao EQUI..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-text focus:ring-2 focus:ring-green outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-green-dark text-white hover:bg-green transition disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <p className="text-xs text-text-secondary text-center mt-4 italic">
        O EQUI fornece informações educativas e de navegação. Não realiza diagnósticos e não substitui profissionais de saúde.
      </p>
    </div>
  );
}
