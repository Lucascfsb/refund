import { Request, Response } from "express";
import { UserRole } from "../generated/prisma/client";
import { z } from "zod";

class UsersController {
  async create(req: Request, res: Response) {
    const bodySchema = z.object({
      name: z.string().min(1, "Name is required").trim(),
      email: z.email("Invalid email address").trim().toLowerCase(),
      password: z
        .string()
        .min(6, "Password must be at least 6 characters long")
        .trim(),
      role: z.enum(UserRole).default(UserRole.employee),
    });

    const { name, email, password, role } = bodySchema.parse(req.body);

    res.status(201).json({ name, email, password, role });
  }
}

export { UsersController };
