import { Request, Response } from "express";
import z, { ZodError } from "zod";

import uploadConfig from "@/configs/upload";
import DiskStorage from "@/providers/disk-storage";
import { AppError } from "@/utils/AppError";

class UploadsController {
  async create(req: Request, res: Response) {
    const diskStorage = new DiskStorage();
    try {
      const fileSchema = z
        .object({
          filename: z.string().min(1, "Filename is required"),
          originalname: z.string(),
          mimetype: z
            .string()
            .refine((type) => uploadConfig.ACCEPTED_MIME_TYPES.includes(type), {
              message: `Invalid file type. Allowed types are: ${uploadConfig.ACCEPTED_MIME_TYPES}`,
            }),
          size: z
            .number()
            .positive()
            .refine((size) => size <= uploadConfig.MAX_FILE_SIZE, {
              message: `File size exceeds the maximum limit of ${uploadConfig.MAX_SIZE} MB`,
            }),
        })
        .loose();

      const file = fileSchema.parse(req.file);
      const filename = await diskStorage.saveFile(file.filename);

      res.json({ filename });
    } catch (error) {
      if (error instanceof ZodError) {
        if (req.file) {
          await diskStorage.deleteFile(req.file.filename, "tmp");
        }

        throw new AppError(error.issues[0].message);
      }
      throw error;
    }
  }
}

export { UploadsController };
