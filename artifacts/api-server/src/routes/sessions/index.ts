import { Router, type IRouter } from "express";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db, sessionsTable, sessionRegistrationsTable, usersTable } from "@workspace/db";
import { requireAuth } from "../../middlewares/auth";
import crypto from "crypto";

const router: IRouter = Router();

function generateSessionId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `TIS-${suffix}`;
}

function generateRegId(): string {
  return `REG-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;
}

const CreateSessionSchema = z.object({
  titre: z.string().min(1),
  description: z.string().min(1),
  specialiteCible: z.string().min(1),
  dateSession: z.string().min(1),
  heureDebut: z.string().min(1),
  dureeMinutes: z.number().int().min(30).max(480).default(90),
  lienVideo: z.string().url(),
  placesMax: z.number().int().min(1).max(500).default(50),
});

const UpdateSessionSchema = CreateSessionSchema.partial().extend({
  statut: z.enum(["planifiee", "en_cours", "terminee", "annulee"]).optional(),
});

router.get("/sessions", async (req, res): Promise<void> => {
  const sessions = await db
    .select({
      id: sessionsTable.id,
      titre: sessionsTable.titre,
      description: sessionsTable.description,
      specialiteCible: sessionsTable.specialiteCible,
      dateSession: sessionsTable.dateSession,
      heureDebut: sessionsTable.heureDebut,
      dureeMinutes: sessionsTable.dureeMinutes,
      placesMax: sessionsTable.placesMax,
      statut: sessionsTable.statut,
      createdAt: sessionsTable.createdAt,
      formateurId: sessionsTable.formateurId,
      formateurPrenom: usersTable.prenom,
      formateurNom: usersTable.nom,
      formateurUniversite: usersTable.universite,
      formateurSpecialite: usersTable.specialite,
    })
    .from(sessionsTable)
    .leftJoin(usersTable, eq(sessionsTable.formateurId, usersTable.id))
    .orderBy(sessionsTable.dateSession);

  const sessionIds = sessions.map((s) => s.id);
  const counts: Record<string, number> = {};
  if (sessionIds.length > 0) {
    for (const s of sessions) {
      const regs = await db
        .select()
        .from(sessionRegistrationsTable)
        .where(eq(sessionRegistrationsTable.sessionId, s.id));
      counts[s.id] = regs.length;
    }
  }

  res.json({
    sessions: sessions.map((s) => ({ ...s, inscrits: counts[s.id] ?? 0 })),
  });
});

router.get("/sessions/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [session] = await db
    .select({
      id: sessionsTable.id,
      titre: sessionsTable.titre,
      description: sessionsTable.description,
      specialiteCible: sessionsTable.specialiteCible,
      dateSession: sessionsTable.dateSession,
      heureDebut: sessionsTable.heureDebut,
      dureeMinutes: sessionsTable.dureeMinutes,
      lienVideo: sessionsTable.lienVideo,
      placesMax: sessionsTable.placesMax,
      statut: sessionsTable.statut,
      createdAt: sessionsTable.createdAt,
      formateurId: sessionsTable.formateurId,
      formateurPrenom: usersTable.prenom,
      formateurNom: usersTable.nom,
      formateurUniversite: usersTable.universite,
      formateurSpecialite: usersTable.specialite,
    })
    .from(sessionsTable)
    .leftJoin(usersTable, eq(sessionsTable.formateurId, usersTable.id))
    .where(eq(sessionsTable.id, id));

  if (!session) {
    res.status(404).json({ error: "Session introuvable" });
    return;
  }

  const regs = await db
    .select()
    .from(sessionRegistrationsTable)
    .where(eq(sessionRegistrationsTable.sessionId, id));

  res.json({ session: { ...session, inscrits: regs.length } });
});

router.post("/sessions", requireAuth, async (req, res): Promise<void> => {
  if (req.jwtUser!.role !== "formateur") {
    res.status(403).json({ error: "Seuls les formateurs peuvent créer des sessions" });
    return;
  }

  const parsed = CreateSessionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let id = generateSessionId();
  let tries = 0;
  while (tries < 5) {
    const exists = await db.select().from(sessionsTable).where(eq(sessionsTable.id, id));
    if (exists.length === 0) break;
    id = generateSessionId();
    tries++;
  }

  const [session] = await db
    .insert(sessionsTable)
    .values({ id, formateurId: req.jwtUser!.userId, ...parsed.data })
    .returning();

  res.status(201).json({ session });
});

router.put("/sessions/:id", requireAuth, async (req, res): Promise<void> => {
  const sessionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const [existing] = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.id, sessionId));

  if (!existing) {
    res.status(404).json({ error: "Session introuvable" });
    return;
  }
  if (existing.formateurId !== req.jwtUser!.userId) {
    res.status(403).json({ error: "Accès refusé" });
    return;
  }

  const parsed = UpdateSessionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db
    .update(sessionsTable)
    .set(parsed.data)
    .where(eq(sessionsTable.id, sessionId))
    .returning();

  res.json({ session: updated });
});

router.post("/sessions/:id/start", requireAuth, async (req, res): Promise<void> => {
  const sessionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const [existing] = await db
    .select()
    .from(sessionsTable)
    .where(eq(sessionsTable.id, sessionId));

  if (!existing) {
    res.status(404).json({ error: "Session introuvable" });
    return;
  }
  if (existing.formateurId !== req.jwtUser!.userId) {
    res.status(403).json({ error: "Seul le formateur propriétaire peut démarrer cette session" });
    return;
  }

  const [updated] = await db
    .update(sessionsTable)
    .set({ statut: "en_cours" })
    .where(eq(sessionsTable.id, sessionId))
    .returning();

  res.json({ session: updated, lienVideo: existing.lienVideo });
});

router.post("/sessions/:id/end", requireAuth, async (req, res): Promise<void> => {
  const sessionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [existing] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, sessionId));
  if (!existing || existing.formateurId !== req.jwtUser!.userId) {
    res.status(403).json({ error: "Accès refusé" });
    return;
  }
  const [updated] = await db
    .update(sessionsTable)
    .set({ statut: "terminee" })
    .where(eq(sessionsTable.id, sessionId))
    .returning();
  res.json({ session: updated });
});

router.delete("/sessions/:id", requireAuth, async (req, res): Promise<void> => {
  const sessionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [existing] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, sessionId));
  if (!existing || existing.formateurId !== req.jwtUser!.userId) {
    res.status(403).json({ error: "Accès refusé" });
    return;
  }
  await db.delete(sessionRegistrationsTable).where(eq(sessionRegistrationsTable.sessionId, sessionId));
  await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
  res.sendStatus(204);
});

router.post("/sessions/:id/register", requireAuth, async (req, res): Promise<void> => {
  if (req.jwtUser!.role !== "apprenant") {
    res.status(403).json({ error: "Seuls les apprenants peuvent s'inscrire à une session" });
    return;
  }
  const sessionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, sessionId));
  if (!session) {
    res.status(404).json({ error: "Session introuvable" });
    return;
  }
  if (session.statut === "terminee" || session.statut === "annulee") {
    res.status(400).json({ error: "Cette session n'accepte plus d'inscriptions" });
    return;
  }

  const existing = await db
    .select()
    .from(sessionRegistrationsTable)
    .where(
      and(
        eq(sessionRegistrationsTable.sessionId, sessionId),
        eq(sessionRegistrationsTable.apprenantId, req.jwtUser!.userId)
      )
    );
  if (existing.length > 0) {
    res.status(409).json({ error: "Vous êtes déjà inscrit à cette session" });
    return;
  }

  const regs = await db
    .select()
    .from(sessionRegistrationsTable)
    .where(eq(sessionRegistrationsTable.sessionId, sessionId));
  if (regs.length >= session.placesMax) {
    res.status(400).json({ error: "Cette session est complète" });
    return;
  }

  const [reg] = await db
    .insert(sessionRegistrationsTable)
    .values({ id: generateRegId(), sessionId, apprenantId: req.jwtUser!.userId })
    .returning();

  res.status(201).json({ registration: reg });
});

router.get("/sessions/:id/registrations", requireAuth, async (req, res): Promise<void> => {
  const sessionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [session] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, sessionId));
  if (!session || session.formateurId !== req.jwtUser!.userId) {
    res.status(403).json({ error: "Accès refusé" });
    return;
  }
  const regs = await db
    .select({
      id: sessionRegistrationsTable.id,
      registeredAt: sessionRegistrationsTable.registeredAt,
      apprenantId: usersTable.id,
      prenom: usersTable.prenom,
      nom: usersTable.nom,
      email: usersTable.email,
      universite: usersTable.universite,
      specialite: usersTable.specialite,
      typeCompte: usersTable.typeCompte,
    })
    .from(sessionRegistrationsTable)
    .leftJoin(usersTable, eq(sessionRegistrationsTable.apprenantId, usersTable.id))
    .where(eq(sessionRegistrationsTable.sessionId, sessionId));
  res.json({ registrations: regs });
});

router.get("/sessions/:id/my-registration", requireAuth, async (req, res): Promise<void> => {
  const sessionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const regs = await db
    .select()
    .from(sessionRegistrationsTable)
    .where(
      and(
        eq(sessionRegistrationsTable.sessionId, sessionId),
        eq(sessionRegistrationsTable.apprenantId, req.jwtUser!.userId)
      )
    );
  res.json({ registered: regs.length > 0 });
});

export default router;
