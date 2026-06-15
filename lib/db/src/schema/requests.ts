import { pgTable, varchar, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const individualRequestsTable = pgTable("individual_requests", {
  id: varchar("id", { length: 20 }).primaryKey(),
  apprenantId: varchar("apprenant_id", { length: 20 }).notNull(),
  formateurId: varchar("formateur_id", { length: 20 }).notNull(),
  sujet: varchar("sujet", { length: 300 }).notNull(),
  message: text("message").notNull(),
  niveauActuel: varchar("niveau_actuel", { length: 100 }),
  objectif: varchar("objectif", { length: 300 }),
  statut: varchar("statut", { length: 20 }).notNull().default("en_attente"),
  messageReponse: text("message_reponse"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const requestProposedDatesTable = pgTable("request_proposed_dates", {
  id: varchar("id", { length: 20 }).primaryKey(),
  requestId: varchar("request_id", { length: 20 }).notNull(),
  dateSession: varchar("date_session", { length: 20 }).notNull(),
  heureDebut: varchar("heure_debut", { length: 10 }).notNull(),
  dureeMinutes: integer("duree_minutes").notNull().default(90),
  lienVideo: varchar("lien_video", { length: 500 }),
  isConfirmed: boolean("is_confirmed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const notificationsTable = pgTable("notifications", {
  id: varchar("id", { length: 30 }).primaryKey(),
  userId: varchar("user_id", { length: 20 }).notNull(),
  type: varchar("type", { length: 60 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  relatedId: varchar("related_id", { length: 30 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type IndividualRequest = typeof individualRequestsTable.$inferSelect;
export type RequestProposedDate = typeof requestProposedDatesTable.$inferSelect;
export type Notification = typeof notificationsTable.$inferSelect;
