import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";

const CategoriesEnum = z.enum([
  "food",
  "other",
  "services",
  "transport",
  "accommodation",
]);

class RefundsController {
  async create(req: Request, res: Response) {
    const bodySchema = z.object({
      name: z.string().min(1, "Name is required").trim(),
      category: CategoriesEnum,
      amount: z.number().positive("Amount must be a positive number"),
      filename: z.string().min(20, "Filename is required"),
    });

    const { name, category, amount, filename } = bodySchema.parse(req.body);

    if (!req.user?.id) {
      throw new AppError("Unauthorized", 401);
    }

    const refund = await prisma.refund.create({
      data: {
        name,
        category,
        amount,
        filename,
        userId: req.user?.id,
      },
    });

    res.status(201).json(refund);
  }

  async index(req: Request, res: Response) {
    const querySchema = z.object({
      name: z.string().optional().default(""),
      page: z.coerce.number().optional().default(1),
      perPage: z.coerce.number().optional().default(10),
    });

    const { name, page, perPage } = querySchema.parse(req.query);

    const skip = (page - 1) * perPage;

    const refunds = await prisma.refund.findMany({
      skip,
      take: perPage,
      where: {
        user: {
          name: {
            contains: name.trim(),
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: { user: true },
    });

    const totalRecords = await prisma.refund.count({
      where: {
        user: {
          name: {
            contains: name.trim(),
          },
        },
      },
    });

    const totalPages = Math.ceil(totalRecords / perPage);

    res.json({
      refunds,
      pagination: {
        totalRecords,
        totalPages: totalPages > 0 ? totalPages : 1,
        page,
        perPage,
      },
    });
  }

  async show(req: Request, res: Response) {
    const paramsSchema = z.object({
      id: z.uuid("Invalid refund ID"),
    });

    const { id } = paramsSchema.parse(req.params);

    const refund = await prisma.refund.findFirst({
      where: { id },
      include: { user: true },
    });

    res.json(refund);
  }
}

export { RefundsController };
