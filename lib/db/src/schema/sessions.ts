import { pgTable, varchar, text, integer, timestamp } from "drizzle-orm/pg-core";

export const sessionsTable = pgTable("sessions", {
  id: varchar("id", { length: 20 }).primaryKey(),
  formateurId: varchar("formateur_id", { length: 20 }).notNull(),
  titre: varchar("titre", { length: 300 }).notNull(),
  description: text("description").notNull(),
  specialiteCible: varchar("specialite_cible", { length: 200 }).notNull(),
  dateSession: varchar("date_session", { length: 20 }).notNull(),
  heureDebut: varchar("heure_debut", { length: 10 }).notNull(),
  dureeMinutes: integer("duree_minutes").notNull().default(90),
  lienVideo: varchar("lien_video", { length: 500 }).notNull(),
  placesMax: integer("places_max").notNull().default(50),
  statut: varchar("statut", { length: 20 }).notNull().default("planifiee"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const sessionRegistrationsTable = pgTable("session_registrations", {
  id: varchar("id", { length: 30 }).primaryKey(),
  sessionId: varchar("session_id", { length: 20 }).notNull(),
  apprenantId: varchar("apprenant_id", { length: 20 }).notNull(),
  registeredAt: timestamp("registered_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Session = typeof sessionsTable.$inferSelect;
export type SessionRegistration = typeof sessionRegistrationsTable.$inferSelect;
