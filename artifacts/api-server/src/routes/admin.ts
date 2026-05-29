import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, usersTable, enquiriesTable } from "@workspace/db";

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

export default router;
