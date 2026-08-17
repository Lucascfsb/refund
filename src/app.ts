import express from "express";
import cors from "cors";

import { router } from "@/routes/index";
import { errorHandling } from "@/middlewares/error-handling";

const app = express();

app.use(cors());

app.use(express.json());

app.use(router);

app.use(errorHandling);

export { app };
