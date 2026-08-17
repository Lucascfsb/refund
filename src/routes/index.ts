import { Router } from "express";

import { usersRoutes } from "@/routes/users-routes";
import { sessionsRoutes } from "@/routes/sessions-routes";

const router = Router();

router.use("/users", usersRoutes);
router.use("/sessions", sessionsRoutes);

export { router };
