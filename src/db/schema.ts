import { pgTable, text, integer, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";

// User profiles
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Hydration records
export const hydrationRecords = pgTable("hydration_records", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  amountMl: integer("amount_ml").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
});

// Sleep records
export const sleepRecords = pgTable("sleep_records", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  date: text("date").notNull(),
  sleepTime: text("sleep_time").notNull(),
  wakeTime: text("wake_time").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
});

// Movement records
export const movementRecords = pgTable("movement_records", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  date: text("date").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
});

// Focus/Pomodoro records
export const focusRecords = pgTable("focus_records", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  completed: boolean("completed").notNull().default(true),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
});

// Check-in records
export const checkinRecords = pgTable("checkin_records", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  responses: jsonb("responses").notNull(),
  result: jsonb("result").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
});

// Quiz records
export const quizRecords = pgTable("quiz_records", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  answers: jsonb("answers").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).defaultNow().notNull(),
});

// XP and achievements
export const userProgress = pgTable("user_progress", {
  userId: text("user_id").primaryKey(),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  achievements: jsonb("achievements").$type<string[]>().default([]),
  pomodoroCount: integer("pomodoro_count").notNull().default(0),
  quizCount: integer("quiz_count").notNull().default(0),
  checkinCount: integer("checkin_count").notNull().default(0),
  ergonomicsCompleted: boolean("ergonomics_completed").notNull().default(false),
  contentExplored: integer("content_explored").notNull().default(0),
  equiConversations: integer("equi_conversations").notNull().default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// User settings
export const userSettings = pgTable("user_settings", {
  userId: text("user_id").primaryKey(),
  fontSize: text("font_size").default("normal"),
  highContrast: boolean("high_contrast").default(false),
  reduceAnimations: boolean("reduce_animations").default(false),
  underlineLinks: boolean("underline_links").default(false),
  soundEnabled: boolean("sound_enabled").default(true),
  notificationsEnabled: boolean("notifications_enabled").default(true),
  darkMode: boolean("dark_mode").default(false),
  pomodoroFocusMinutes: integer("pomodoro_focus_minutes").default(25),
  pomodoroBreakMinutes: integer("pomodoro_break_minutes").default(5),
  pomodoroLongBreakMinutes: integer("pomodoro_long_break_minutes").default(15),
});
