"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock, ArrowRight, ChevronRight } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { ARTICLES } from "@/lib/data";

const CATEGORIES = ["Todos", "Sono", "Hidratação", "Ergonomia", "Foco", "Movimento", "Uso de telas", "Bem-estar emocional"];

export default function AprenderPage() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);
  const markContentExplored = useAppStore((s) => s.markContentExplored);

  const filtered = selectedCategory === "Todos" ? ARTICLES : ARTICLES.filter(a => a.category === selectedCategory);

  const handleRead = (id: string) => {
    if (expandedArticle === id) {
      setExpandedArticle(null);
    } else {
      setExpandedArticle(id);
      markContentExplored();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-green-dark mb-1 flex items-center gap-2">
          <BookOpen className="text-green" /> Aprender
        </h1>
        <p className="text-text-secondary mb-6">Biblioteca educativa sobre saúde e bem-estar.</p>
      </motion.div>

      {/* Category filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              selectedCategory === cat ? "bg-green-dark text-white" : "bg-border-light text-text hover:bg-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Articles */}
      <div className="space-y-4">
        {filtered.map((article, i) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="bg-card rounded-xl border border-border overflow-hidden"
          >
            <button
              onClick={() => handleRead(article.id)}
              className="w-full p-5 text-left hover:bg-border-light/50 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-green bg-green-light/50 px-2 py-0.5 rounded">{article.category}</span>
                    <span className="text-xs text-text-secondary flex items-center gap-1"><Clock size={10} /> {article.readTime}</span>
                  </div>
                  <h3 className="font-semibold text-text mb-1">{article.title}</h3>
                  <p className="text-sm text-text-secondary">{article.description}</p>
                </div>
                <ChevronRight size={18} className={`text-text-secondary flex-shrink-0 transition ${expandedArticle === article.id ? "rotate-90" : ""}`} />
              </div>
            </button>

            {expandedArticle === article.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="px-5 pb-5 border-t border-border-light"
              >
                <div className="pt-4 space-y-4">
                  {article.sections.map((section, j) => (
                    <div key={j}>
                      <h4 className="font-semibold text-green-dark mb-1">{section.heading}</h4>
                      <p className="text-sm text-text leading-relaxed">{section.text}</p>
                    </div>
                  ))}
                  {article.sources.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border-light">
                      <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Fontes</p>
                      <div className="space-y-1">
                        {article.sources.map((source, j) => (
                          <a
                            key={j}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue hover:underline flex items-center gap-1"
                          >
                            {source.title} <ArrowRight size={10} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-text-secondary py-8">Nenhum conteúdo nesta categoria.</p>
      )}
    </div>
  );
}
