import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";

class RefundsController {
  async create(req: Request, res: Response) {
    res.json({ message: "Refund created successfully" });
  }
}

export { RefundsController };
