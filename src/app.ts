import express from "express";
import cors from "cors";

import { router } from "@/routes/index";
import { errorHandling } from "@/middlewares/error-handling";
import uploadConfig from "@/configs/upload";

const app = express();

app.use(cors());

app.use(express.json());
app.use("/uploads", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(router);

app.use(errorHandling);

export { app };
