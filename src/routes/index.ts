import { Router } from "express";

import { usersRoutes } from "@/routes/users-routes";
import { sessionsRoutes } from "@/routes/sessions-routes";
import { refundsRoutes } from "@/routes/refunds-routes";
import { uploadsRoutes } from "@/routes/upload-routes";

import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";

const router = Router();

//Rotas públicas
router.use("/users", usersRoutes);
router.use("/sessions", sessionsRoutes);

//Rotas privadas
router.use(ensureAuthenticated);
router.use("/refunds", refundsRoutes);
router.use("/uploads", uploadsRoutes);

export { router };
