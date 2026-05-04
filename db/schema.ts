import {
  pgTable,
  serial,
  varchar,
  real,
  text,
  integer,
  timestamp,
  jsonb,
  boolean,
} from "drizzle-orm/pg-core";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  anonymousId: varchar("anonymous_id", { length: 255 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  fullName: text("full_name"),
  latestSecurityScore: real("latest_security_score"),
  finishedTutorial: boolean("finished_tutorial").default(false).notNull(),
  finishedAssessment: boolean("finished_assessment").default(false).notNull(),
  finishedAdvice: boolean("finished_advice").default(false).notNull(),
  finishedPassword: boolean("finished_password").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  behavioralScore: integer("behavioral_score").notNull(),
  // Right now, derived from AI
  riskLevel: varchar("risk_level", { length: 50 }).notNull(), // 'Low', 'Medium', 'High'
  totalScore: integer("total_score").notNull(),
  rawResponses: jsonb("raw_responses"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  assessmentId: integer("assessment_id").references(() => assessments.id),
  title: text("title").default("New Chat").notNull(),
  messages: jsonb("messages").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const errorLogs = pgTable("error_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: varchar("action", { length: 255 }).notNull(),
  error: text("error").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Assessment = InferSelectModel<typeof assessments>;
export type NewAssessment = InferInsertModel<typeof assessments>;
export type ChatSession = InferSelectModel<typeof chatSessions>;
export type NewChatSession = InferInsertModel<typeof chatSessions>;
export type ErrorLog = InferSelectModel<typeof errorLogs>;
export type NewErrorLog = InferInsertModel<typeof errorLogs>;
