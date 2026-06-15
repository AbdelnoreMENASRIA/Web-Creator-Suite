import { pgTable, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: varchar("id", { length: 20 }).primaryKey(),
  role: varchar("role", { length: 20 }).notNull(),
  prenom: varchar("prenom", { length: 100 }).notNull(),
  nom: varchar("nom", { length: 100 }).notNull(),
  age: integer("age").notNull(),
  numero: varchar("numero", { length: 100 }).notNull(),
  typeCompte: varchar("type_compte", { length: 20 }).notNull(),
  universite: varchar("universite", { length: 200 }).notNull(),
  faculte: varchar("faculte", { length: 200 }).notNull(),
  departement: varchar("departement", { length: 200 }).notNull(),
  email: varchar("email", { length: 200 }).notNull().unique(),
  specialite: varchar("specialite", { length: 200 }).notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  resetToken: varchar("reset_token", { length: 255 }),
  resetTokenExpiry: timestamp("reset_token_expiry", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  passwordHash: true,
  resetToken: true,
  resetTokenExpiry: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
