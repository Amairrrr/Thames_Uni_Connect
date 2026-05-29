import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import enquiriesRouter from "./enquiries";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(enquiriesRouter);
router.use(adminRouter);

export default router;
