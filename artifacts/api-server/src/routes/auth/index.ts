import { Router, type IRouter, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db, usersTable } from "@workspace/db";
import { requireAuth, signToken } from "../../middlewares/auth";
import { logger } from "../../lib/logger";
import crypto from "crypto";

const router: IRouter = Router();

// Error handler wrapper for async routes
const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => 
  (req: Request, res: Response, next: any) => {
    Promise.resolve(fn(req, res)).catch(next);
  };

function generateUserId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `TIE-${suffix}`;
}

const RegisterSchema = z.object({
  role: z.enum(["apprenant", "formateur"]),
  prenom: z.string().min(1),
  nom: z.string().min(1),
  age: z.number().int().min(18).max(99),
  numero: z.string().min(1),
  typeCompte: z.enum(["doctorant", "enseignant"]),
  universite: z.string().min(1),
  faculte: z.string().min(1),
  departement: z.string().min(1),
  email: z.string().email(),
  specialite: z.string().min(1),
  password: z.string().min(8),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const ForgotSchema = z.object({
  email: z.string().email(),
});

const ResetSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});

const UpdateProfileSchema = z.object({
  prenom: z.string().min(1).optional(),
  nom: z.string().min(1).optional(),
  age: z.number().int().min(18).max(99).optional(),
  numero: z.string().min(1).optional(),
  universite: z.string().min(1).optional(),
  faculte: z.string().min(1).optional(),
  departement: z.string().min(1).optional(),
  specialite: z.string().min(1).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
});

function safeUser(user: typeof usersTable.$inferSelect) {
  const { passwordHash, resetToken, resetTokenExpiry, ...safe } = user;
  return safe;
}

router.post("/auth/register", asyncHandler(async (req, res) => {
  try {
    const parsed = RegisterSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const data = parsed.data;

    if (data.role === "formateur") {
      if (data.typeCompte !== "enseignant") {
        res.status(400).json({ error: "Seuls les enseignants peuvent être formateurs" });
        return;
      }
      const dept = data.departement.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (!dept.includes("anglais") && !dept.includes("english")) {
        res.status(400).json({
          error: "Seuls les enseignants du département d'Anglais peuvent être formateurs",
        });
        return;
      }
    }

    logger.info({ email: data.email }, "Checking for existing email");
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, data.email));
    if (existing.length > 0) {
      res.status(409).json({ error: "Cet email est déjà utilisé" });
      return;
    }

    let id = generateUserId();
    let tries = 0;
    while (tries < 5) {
      const exists = await db.select().from(usersTable).where(eq(usersTable.id, id));
      if (exists.length === 0) break;
      id = generateUserId();
      tries++;
    }

    logger.info({ id }, "Generated unique user ID");
    
    const passwordHash = await bcrypt.hash(data.password, 12);
    logger.info({ email: data.email, id }, "Inserting new user");
    
    const [user] = await db
      .insert(usersTable)
      .values({
        id,
        role: data.role,
        prenom: data.prenom,
        nom: data.nom,
        age: data.age,
        numero: data.numero,
        typeCompte: data.typeCompte,
        universite: data.universite,
        faculte: data.faculte,
        departement: data.departement,
        email: data.email,
        specialite: data.specialite,
        passwordHash,
      })
      .returning();

    logger.info({ userId: user.id }, "User registered successfully");
    const token = signToken(user.id, user.role);
    res.status(201).json({ token, user: safeUser(user) });
  } catch (error) {
    logger.error({ error, message: error instanceof Error ? error.message : "Unknown error" }, "Register error");
    throw error;
  }
}));

router.post("/auth/login", asyncHandler(async (req, res) => {
  try {
    const parsed = LoginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const { email, password } = parsed.data;

    logger.info({ email }, "Login attempt");
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user) {
      res.status(401).json({ error: "Email ou mot de passe incorrect" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Email ou mot de passe incorrect" });
      return;
    }

    logger.info({ userId: user.id }, "User logged in successfully");
    const token = signToken(user.id, user.role);
    res.json({ token, user: safeUser(user) });
  } catch (error) {
    logger.error({ error, message: error instanceof Error ? error.message : "Unknown error" }, "Login error");
    throw error;
  }
}));

router.get("/auth/me", requireAuth, asyncHandler(async (req, res) => {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.jwtUser!.userId));
    if (!user) {
      res.status(404).json({ error: "Utilisateur introuvable" });
      return;
    }
    res.json({ user: safeUser(user) });
  } catch (error) {
    logger.error({ error }, "Get user error");
    throw error;
  }
}));

router.put("/auth/profile", requireAuth, asyncHandler(async (req, res) => {
  try {
    const parsed = UpdateProfileSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const data = parsed.data;

    const [existing] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, req.jwtUser!.userId));
    if (!existing) {
      res.status(404).json({ error: "Utilisateur introuvable" });
      return;
    }

    const updates: Partial<typeof usersTable.$inferInsert> = {};
    if (data.prenom) updates.prenom = data.prenom;
    if (data.nom) updates.nom = data.nom;
    if (data.age) updates.age = data.age;
    if (data.numero) updates.numero = data.numero;
    if (data.universite) updates.universite = data.universite;
    if (data.faculte) updates.faculte = data.faculte;
    if (data.departement) updates.departement = data.departement;
    if (data.specialite) updates.specialite = data.specialite;

    if (data.newPassword) {
      if (!data.currentPassword) {
        res.status(400).json({ error: "Mot de passe actuel requis" });
        return;
      }
      const valid = await bcrypt.compare(data.currentPassword, existing.passwordHash);
      if (!valid) {
        res.status(400).json({ error: "Mot de passe actuel incorrect" });
        return;
      }
      updates.passwordHash = await bcrypt.hash(data.newPassword, 12);
    }

    const [updated] = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, req.jwtUser!.userId))
      .returning();

    res.json({ user: safeUser(updated) });
  } catch (error) {
    logger.error({ error }, "Update profile error");
    throw error;
  }
}));

router.post("/auth/forgot-password", asyncHandler(async (req, res) => {
  try {
    const parsed = ForgotSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, parsed.data.email));

    if (!user) {
      res.json({ message: "Si cet email existe, un token a été envoyé" });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await db
      .update(usersTable)
      .set({ resetToken, resetTokenExpiry: expiry })
      .where(eq(usersTable.id, user.id));

    res.json({ message: "Token généré", resetToken });
  } catch (error) {
    logger.error({ error }, "Forgot password error");
    throw error;
  }
}));

router.post("/auth/reset-password", asyncHandler(async (req, res) => {
  try {
    const parsed = ResetSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const { token, password } = parsed.data;

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.resetToken, token));

    if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      res.status(400).json({ error: "Token invalide ou expiré" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    await db
      .update(usersTable)
      .set({ passwordHash, resetToken: null, resetTokenExpiry: null })
      .where(eq(usersTable.id, user.id));

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    logger.error({ error }, "Reset password error");
    throw error;
  }
}));

router.get("/auth/users", requireAuth, asyncHandler(async (req, res) => {
  try {
    if (req.jwtUser!.role !== "formateur") {
      res.status(403).json({ error: "Accès réservé aux formateurs" });
      return;
    }
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.role, "apprenant"));
    res.json({ users: users.map(safeUser) });
  } catch (error) {
    logger.error({ error }, "Get users error");
    throw error;
  }
}));

export default router;
