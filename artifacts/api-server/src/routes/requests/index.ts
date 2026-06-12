import { Router, type IRouter } from "express";
import { z } from "zod";
import { eq, and, or, ilike } from "drizzle-orm";
import {
  db, usersTable,
  individualRequestsTable, requestProposedDatesTable, notificationsTable,
} from "@workspace/db";
import { requireAuth } from "../../middlewares/auth";
import crypto from "crypto";

const router: IRouter = Router();

function genId(prefix: string, len = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${s}`;
}

function genNotifId(): string {
  return `NOTIF-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;
}

async function createNotif(userId: string, type: string, message: string, relatedId?: string) {
  await db.insert(notificationsTable).values({
    id: genNotifId(), userId, type, message, relatedId: relatedId ?? null,
  });
}

// ─── SEARCH FORMATEURS ──────────────────────────────────────────────────────

router.get("/formateurs/search", async (req, res): Promise<void> => {
  const q = String(req.query.q ?? "").trim();
  if (!q || q.length < 2) { res.json({ formateurs: [] }); return; }

  const results = await db
    .select({
      id: usersTable.id, prenom: usersTable.prenom, nom: usersTable.nom,
      universite: usersTable.universite, faculte: usersTable.faculte,
      departement: usersTable.departement, specialite: usersTable.specialite,
    })
    .from(usersTable)
    .where(
      and(
        eq(usersTable.role, "formateur"),
        or(
          ilike(usersTable.prenom, `%${q}%`),
          ilike(usersTable.nom, `%${q}%`),
          ilike(usersTable.universite, `%${q}%`),
        )
      )
    )
    .limit(10);

  res.json({ formateurs: results });
});

router.get("/formateurs/:id", async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [f] = await db
    .select({
      id: usersTable.id, prenom: usersTable.prenom, nom: usersTable.nom,
      universite: usersTable.universite, faculte: usersTable.faculte,
      departement: usersTable.departement, specialite: usersTable.specialite,
    })
    .from(usersTable)
    .where(and(eq(usersTable.id, id), eq(usersTable.role, "formateur")));

  if (!f) { res.status(404).json({ error: "Formateur introuvable" }); return; }
  res.json({ formateur: f });
});

// ─── SEND REQUEST (apprenant only) ─────────────────────────────────────────

const CreateRequestSchema = z.object({
  formateurId: z.string(),
  sujet: z.string().min(1).max(300),
  message: z.string().min(10),
  niveauActuel: z.string().optional(),
  objectif: z.string().optional(),
});

router.post("/requests", requireAuth, async (req, res): Promise<void> => {
  if (req.jwtUser!.role !== "apprenant") {
    res.status(403).json({ error: "Seuls les apprenants peuvent envoyer des demandes" });
    return;
  }
  const parsed = CreateRequestSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [formateur] = await db.select().from(usersTable)
    .where(and(eq(usersTable.id, parsed.data.formateurId), eq(usersTable.role, "formateur")));
  if (!formateur) { res.status(404).json({ error: "Formateur introuvable" }); return; }

  // Check no pending request already exists
  const existing = await db.select().from(individualRequestsTable)
    .where(and(
      eq(individualRequestsTable.apprenantId, req.jwtUser!.userId),
      eq(individualRequestsTable.formateurId, parsed.data.formateurId),
      eq(individualRequestsTable.statut, "en_attente"),
    ));
  if (existing.length > 0) {
    res.status(409).json({ error: "Une demande en attente existe déjà avec ce formateur" });
    return;
  }

  const [apprenant] = await db.select().from(usersTable).where(eq(usersTable.id, req.jwtUser!.userId));

  const id = genId("REQ");
  const [request] = await db.insert(individualRequestsTable).values({
    id, apprenantId: req.jwtUser!.userId, ...parsed.data,
  }).returning();

  // Notify formateur
  await createNotif(
    formateur.id,
    "request_received",
    `Nouvelle demande de formation individuelle de ${apprenant?.prenom} ${apprenant?.nom} — "${parsed.data.sujet}"`,
    id,
  );

  req.log.info({ formateurEmail: formateur.email, apprenantNom: `${apprenant?.prenom} ${apprenant?.nom}` },
    "Individual training request sent (email simulation)");

  res.status(201).json({ request });
});

// ─── MY SENT REQUESTS (apprenant) ──────────────────────────────────────────

router.get("/requests/sent", requireAuth, async (req, res): Promise<void> => {
  if (req.jwtUser!.role !== "apprenant") { res.status(403).json({ error: "Accès refusé" }); return; }

  const requests = await db
    .select({
      id: individualRequestsTable.id,
      sujet: individualRequestsTable.sujet,
      message: individualRequestsTable.message,
      niveauActuel: individualRequestsTable.niveauActuel,
      objectif: individualRequestsTable.objectif,
      statut: individualRequestsTable.statut,
      messageReponse: individualRequestsTable.messageReponse,
      createdAt: individualRequestsTable.createdAt,
      updatedAt: individualRequestsTable.updatedAt,
      formateurId: usersTable.id,
      formateurPrenom: usersTable.prenom,
      formateurNom: usersTable.nom,
      formateurUniversite: usersTable.universite,
      formateurSpecialite: usersTable.specialite,
    })
    .from(individualRequestsTable)
    .leftJoin(usersTable, eq(individualRequestsTable.formateurId, usersTable.id))
    .where(eq(individualRequestsTable.apprenantId, req.jwtUser!.userId))
    .orderBy(individualRequestsTable.createdAt);

  // Attach proposed dates for accepted requests
  const enriched = await Promise.all(requests.map(async (r) => {
    if (r.statut === "acceptee") {
      const dates = await db.select().from(requestProposedDatesTable)
        .where(eq(requestProposedDatesTable.requestId, r.id))
        .orderBy(requestProposedDatesTable.dateSession);
      return { ...r, proposedDates: dates };
    }
    return { ...r, proposedDates: [] };
  }));

  res.json({ requests: enriched });
});

// ─── RECEIVED REQUESTS (formateur) ─────────────────────────────────────────

router.get("/requests/received", requireAuth, async (req, res): Promise<void> => {
  if (req.jwtUser!.role !== "formateur") { res.status(403).json({ error: "Accès refusé" }); return; }

  const requests = await db
    .select({
      id: individualRequestsTable.id,
      sujet: individualRequestsTable.sujet,
      message: individualRequestsTable.message,
      niveauActuel: individualRequestsTable.niveauActuel,
      objectif: individualRequestsTable.objectif,
      statut: individualRequestsTable.statut,
      messageReponse: individualRequestsTable.messageReponse,
      createdAt: individualRequestsTable.createdAt,
      updatedAt: individualRequestsTable.updatedAt,
      apprenantId: usersTable.id,
      apprenantPrenom: usersTable.prenom,
      apprenantNom: usersTable.nom,
      apprenantEmail: usersTable.email,
      apprenantUniversite: usersTable.universite,
      apprenantSpecialite: usersTable.specialite,
      apprenantTypeCompte: usersTable.typeCompte,
    })
    .from(individualRequestsTable)
    .leftJoin(usersTable, eq(individualRequestsTable.apprenantId, usersTable.id))
    .where(eq(individualRequestsTable.formateurId, req.jwtUser!.userId))
    .orderBy(individualRequestsTable.createdAt);

  const enriched = await Promise.all(requests.map(async (r) => {
    const dates = await db.select().from(requestProposedDatesTable)
      .where(eq(requestProposedDatesTable.requestId, r.id));
    return { ...r, proposedDates: dates };
  }));

  res.json({ requests: enriched });
});

// ─── ACCEPT REQUEST + PROPOSE DATES ─────────────────────────────────────────

const AcceptSchema = z.object({
  messageReponse: z.string().optional(),
  dates: z.array(z.object({
    dateSession: z.string().min(1),
    heureDebut: z.string().min(1),
    dureeMinutes: z.number().int().min(30).default(90),
    lienVideo: z.string().url().optional(),
  })).min(1).max(5),
});

router.post("/requests/:id/accept", requireAuth, async (req, res): Promise<void> => {
  if (req.jwtUser!.role !== "formateur") { res.status(403).json({ error: "Accès refusé" }); return; }

  const reqId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [existing] = await db.select().from(individualRequestsTable).where(eq(individualRequestsTable.id, reqId));
  if (!existing || existing.formateurId !== req.jwtUser!.userId) {
    res.status(404).json({ error: "Demande introuvable" }); return;
  }

  const parsed = AcceptSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  await db.update(individualRequestsTable)
    .set({ statut: "acceptee", messageReponse: parsed.data.messageReponse ?? null, updatedAt: new Date() })
    .where(eq(individualRequestsTable.id, reqId));

  // Insert proposed dates
  for (const d of parsed.data.dates) {
    await db.insert(requestProposedDatesTable).values({
      id: genId("DATE"), requestId: reqId, ...d, lienVideo: d.lienVideo ?? null,
    });
  }

  const [formateur] = await db.select().from(usersTable).where(eq(usersTable.id, req.jwtUser!.userId));

  await createNotif(
    existing.apprenantId,
    "request_accepted",
    `Votre demande de formation individuelle a été acceptée par ${formateur?.prenom} ${formateur?.nom}. Des créneaux horaires ont été proposés.`,
    reqId,
  );

  req.log.info({ apprenantId: existing.apprenantId }, "Request accepted — email simulation sent");

  res.json({ success: true });
});

// ─── REFUSE REQUEST ──────────────────────────────────────────────────────────

router.post("/requests/:id/refuse", requireAuth, async (req, res): Promise<void> => {
  if (req.jwtUser!.role !== "formateur") { res.status(403).json({ error: "Accès refusé" }); return; }

  const reqId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const [existing] = await db.select().from(individualRequestsTable).where(eq(individualRequestsTable.id, reqId));
  if (!existing || existing.formateurId !== req.jwtUser!.userId) {
    res.status(404).json({ error: "Demande introuvable" }); return;
  }

  const { messageReponse } = req.body as { messageReponse?: string };

  await db.update(individualRequestsTable)
    .set({ statut: "refusee", messageReponse: messageReponse ?? null, updatedAt: new Date() })
    .where(eq(individualRequestsTable.id, reqId));

  const [formateur] = await db.select().from(usersTable).where(eq(usersTable.id, req.jwtUser!.userId));

  await createNotif(
    existing.apprenantId,
    "request_refused",
    `Votre demande de formation individuelle a été refusée par ${formateur?.prenom} ${formateur?.nom}.${messageReponse ? " Message : " + messageReponse : ""}`,
    reqId,
  );

  res.json({ success: true });
});

// ─── CONFIRM DATE (apprenant confirms one proposed date) ────────────────────

router.post("/requests/:id/confirm-date/:dateId", requireAuth, async (req, res): Promise<void> => {
  if (req.jwtUser!.role !== "apprenant") { res.status(403).json({ error: "Accès refusé" }); return; }

  const reqId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const dateId = Array.isArray(req.params.dateId) ? req.params.dateId[0] : req.params.dateId;

  const [existing] = await db.select().from(individualRequestsTable).where(eq(individualRequestsTable.id, reqId));
  if (!existing || existing.apprenantId !== req.jwtUser!.userId) {
    res.status(403).json({ error: "Accès refusé" }); return;
  }

  // Reset all dates for this request then confirm the chosen one
  await db.update(requestProposedDatesTable)
    .set({ isConfirmed: false })
    .where(eq(requestProposedDatesTable.requestId, reqId));

  await db.update(requestProposedDatesTable)
    .set({ isConfirmed: true })
    .where(and(eq(requestProposedDatesTable.id, dateId), eq(requestProposedDatesTable.requestId, reqId)));

  const [apprenant] = await db.select().from(usersTable).where(eq(usersTable.id, req.jwtUser!.userId));
  const [date] = await db.select().from(requestProposedDatesTable).where(eq(requestProposedDatesTable.id, dateId));

  await createNotif(
    existing.formateurId,
    "date_confirmed",
    `${apprenant?.prenom} ${apprenant?.nom} a confirmé le créneau du ${date?.dateSession} à ${date?.heureDebut}.`,
    reqId,
  );

  res.json({ success: true });
});

// ─── NOTIFICATIONS ──────────────────────────────────────────────────────────

router.get("/notifications", requireAuth, async (req, res): Promise<void> => {
  const notifs = await db
    .select()
    .from(notificationsTable)
    .where(eq(notificationsTable.userId, req.jwtUser!.userId))
    .orderBy(notificationsTable.createdAt);

  res.json({ notifications: notifs.reverse() });
});

router.post("/notifications/read-all", requireAuth, async (req, res): Promise<void> => {
  await db.update(notificationsTable)
    .set({ isRead: true })
    .where(eq(notificationsTable.userId, req.jwtUser!.userId));
  res.json({ success: true });
});

router.post("/notifications/:id/read", requireAuth, async (req, res): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  await db.update(notificationsTable).set({ isRead: true })
    .where(and(eq(notificationsTable.id, id), eq(notificationsTable.userId, req.jwtUser!.userId)));
  res.json({ success: true });
});

export default router;
