import { Router, type IRouter } from "express";
import { z } from "zod";
import { db, usersTable } from "@workspace/db";

const router: IRouter = Router();

const RegisterBody = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  country: z.string().min(1),
  courseInterest: z.string().min(1),
});

router.post("/users", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [user] = await db
      .insert(usersTable)
      .values(parsed.data)
      .returning();
    req.log.info({ userId: user.id }, "User registered");
    res.status(201).json(user);
  } catch (err: any) {
    req.log.error({ err }, "Failed to register user");
    res.status(500).json({ error: "Failed to save registration" });
  }
});

export default router;
