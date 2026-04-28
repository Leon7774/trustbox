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
  totalScore: integer("total_score").notNull(),
  riskLevel: varchar("risk_level", { length: 50 }).notNull(), // 'Low', 'Medium', 'High'
  recommendedActions: text("recommended_actions").notNull(),
  rawResponses: jsonb("raw_responses"), // Store answers structure for historical analysis if needed
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Assessment = InferSelectModel<typeof assessments>;
export type NewAssessment = InferInsertModel<typeof assessments>;
