import { Router, type IRouter, type Request, type Response } from "express";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db, sessionsTable, sessionRegistrationsTable, usersTable } from "@workspace/db";
import { requireAuth } from "../../middlewares/auth";
import { logger } from "../../lib/logger";
import crypto from "crypto";

const router: IRouter = Router();

// Error handler wrapper
const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => 
  (req: Request, res: Response, next: any) => {
    Promise.resolve(fn(req, res)).catch(next);
  };

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

router.get("/sessions", asyncHandler(async (req, res) => {
  try {
    logger.info("Fetching all sessions");
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
  } catch (error) {
    logger.error({ error }, "Failed to fetch sessions");
    throw error;
  }
}));

router.get("/sessions/:id", asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    logger.error({ error }, "Failed to fetch session");
    throw error;
  }
}));

router.post("/sessions", requireAuth, asyncHandler(async (req, res) => {
  try {
    logger.info({ userId: req.jwtUser!.userId, role: req.jwtUser!.role }, "Create session request");
    
    if (req.jwtUser!.role !== "formateur") {
      logger.warn({ userId: req.jwtUser!.userId }, "Non-formateur tried to create session");
      res.status(403).json({ error: "Seuls les formateurs peuvent créer des sessions" });
      return;
    }

    const parsed = CreateSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      logger.warn({ error: parsed.error.message }, "Invalid session data");
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

    logger.info({ sessionId: id, formateurId: req.jwtUser!.userId }, "Inserting new session");
    
    const [session] = await db
      .insert(sessionsTable)
      .values({ id, formateurId: req.jwtUser!.userId, ...parsed.data })
      .returning();

    logger.info({ sessionId: session.id }, "Session created successfully");
    res.status(201).json({ session });
  } catch (error) {
    logger.error({ error, message: error instanceof Error ? error.message : "Unknown error" }, "Create session error");
    throw error;
  }
}));

router.put("/sessions/:id", requireAuth, asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    logger.error({ error }, "Update session error");
    throw error;
  }
}));

router.post("/sessions/:id/start", requireAuth, asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    logger.error({ error }, "Start session error");
    throw error;
  }
}));

router.post("/sessions/:id/end", requireAuth, asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    logger.error({ error }, "End session error");
    throw error;
  }
}));

router.delete("/sessions/:id", requireAuth, asyncHandler(async (req, res) => {
  try {
    const sessionId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const [existing] = await db.select().from(sessionsTable).where(eq(sessionsTable.id, sessionId));
    if (!existing || existing.formateurId !== req.jwtUser!.userId) {
      res.status(403).json({ error: "Accès refusé" });
      return;
    }
    await db.delete(sessionRegistrationsTable).where(eq(sessionRegistrationsTable.sessionId, sessionId));
    await db.delete(sessionsTable).where(eq(sessionsTable.id, sessionId));
    res.sendStatus(204);
  } catch (error) {
    logger.error({ error }, "Delete session error");
    throw error;
  }
}));

router.post("/sessions/:id/register", requireAuth, asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    logger.error({ error }, "Register to session error");
    throw error;
  }
}));

router.get("/sessions/:id/registrations", requireAuth, asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    logger.error({ error }, "Get registrations error");
    throw error;
  }
}));

router.get("/sessions/:id/my-registration", requireAuth, asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    logger.error({ error }, "Get my registration error");
    throw error;
  }
}));

export default router;
