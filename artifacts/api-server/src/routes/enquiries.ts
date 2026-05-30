import { Router, type IRouter } from "express";
import { z } from "zod";
import { db, enquiriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { sendNewEnquiryNotification } from "../lib/email";

const router: IRouter = Router();

const CreateEnquiryBody = z.object({
  name: z.string().min(1),
  email: z.string().default(""),
  phone: z.string().min(5),
  country: z.string().min(1),
  destination: z.string().min(1),
  course: z.string().min(1),
});

const UpdateStatusBody = z.object({
  status: z.enum(["pending", "contacted", "in_progress", "completed"]),
});

router.post("/enquiries", async (req, res): Promise<void> => {
  const parsed = CreateEnquiryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const [enquiry] = await db
      .insert(enquiriesTable)
      .values(parsed.data)
      .returning();
    req.log.info({ enquiryId: enquiry.id }, "Enquiry submitted");
    res.status(201).json(enquiry);

    // Fire-and-forget email — don't block the response
    sendNewEnquiryNotification({
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      country: enquiry.country,
      destination: enquiry.destination,
      course: enquiry.course,
      submittedAt: enquiry.submittedAt,
    }).catch(() => {});
  } catch (err: any) {
    req.log.error({ err }, "Failed to save enquiry");
    res.status(500).json({ error: "Failed to save enquiry" });
  }
});

router.patch("/enquiries/:id/status", async (req, res): Promise<void> => {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== process.env["ADMIN_PASSWORD"]) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  if (Number.isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const parsed = UpdateStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [updated] = await db
    .update(enquiriesTable)
    .set({ status: parsed.data.status })
    .where(eq(enquiriesTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Enquiry not found" });
    return;
  }

  res.json(updated);
});

export default router;
