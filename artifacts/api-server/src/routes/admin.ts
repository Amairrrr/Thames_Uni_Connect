import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { db, usersTable, enquiriesTable } from "@workspace/db";
import { Resend } from "resend";

const router: IRouter = Router();

function requireAdmin(req: any, res: any, next: any) {
  const key = req.headers["x-admin-key"];
  const expected = process.env["ADMIN_PASSWORD"];
  if (!expected || key !== expected) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.use("/admin", requireAdmin);

router.get("/admin/stats", async (req, res): Promise<void> => {
  const users = await db.select().from(usersTable);
  const enquiries = await db.select().from(enquiriesTable);

  const byStatus = enquiries.reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] ?? 0) + 1;
    return acc;
  }, {});

  const byCountry = enquiries.reduce<Record<string, number>>((acc, e) => {
    acc[e.country] = (acc[e.country] ?? 0) + 1;
    return acc;
  }, {});

  const byCourse = enquiries.reduce<Record<string, number>>((acc, e) => {
    acc[e.course] = (acc[e.course] ?? 0) + 1;
    return acc;
  }, {});

  const byDestination = enquiries.reduce<Record<string, number>>((acc, e) => {
    acc[e.destination] = (acc[e.destination] ?? 0) + 1;
    return acc;
  }, {});

  res.json({
    totalUsers: users.length,
    totalEnquiries: enquiries.length,
    byStatus,
    byCountry,
    byCourse,
    byDestination,
  });
});

router.get("/admin/users", async (req, res): Promise<void> => {
  const users = await db
    .select()
    .from(usersTable)
    .orderBy(desc(usersTable.registeredAt));
  res.json(users);
});

router.get("/admin/enquiries", async (req, res): Promise<void> => {
  const enquiries = await db
    .select()
    .from(enquiriesTable)
    .orderBy(desc(enquiriesTable.submittedAt));
  res.json(enquiries);
});

const SendEmailBody = z.object({
  toEmail: z.string().email(),
  toName: z.string().min(1),
  message: z.string().min(1),
});

router.post("/admin/send-email", async (req, res): Promise<void> => {
  const parsed = SendEmailBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) {
    res.status(503).json({ error: "Email service not configured" });
    return;
  }

  const { toEmail, toName, message } = parsed.data;
  const resend = new Resend(apiKey);

  const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#ffffff;">
  <div style="background:#0F2D5E;border-radius:12px 12px 0 0;padding:20px 24px;">
    <p style="margin:0;color:#ffffff;font-size:18px;font-weight:700;">Thames Uni Connect</p>
    <p style="margin:4px 0 0;color:rgba(255,255,255,0.6);font-size:12px;">British Council Certified · London, UK</p>
  </div>
  <div style="border:1px solid #E5E7EB;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
    <p style="margin:0 0 16px;color:#374151;font-size:15px;line-height:1.7;white-space:pre-line;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
    <hr style="border:none;border-top:1px solid #F3F4F6;margin:20px 0;"/>
    <p style="margin:0;color:#9CA3AF;font-size:12px;">
      Thames Uni Connect · <a href="mailto:admin@thamesuniconnect.com" style="color:#0F2D5E;">admin@thamesuniconnect.com</a>
      &nbsp;·&nbsp;<a href="https://wa.me/447359854658" style="color:#059669;">WhatsApp: +44 7359 854658</a>
    </p>
  </div>
</div>`.trim();

  const { error } = await resend.emails.send({
    from: "Thames Uni Connect <onboarding@resend.dev>",
    reply_to: "admin@thamesuniconnect.com",
    to: [toEmail],
    subject: `Message from Thames Uni Connect`,
    html,
  });

  if (error) {
    req.log.error({ error }, "Failed to send contact email");
    res.status(502).json({ error: "Failed to send email" });
    return;
  }

  req.log.info({ to: toEmail, toName }, "Contact email sent by admin");
  res.json({ ok: true });
});

export default router;
