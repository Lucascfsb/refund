import { Request, Response } from "express";
import { UserRole } from "@/generated/prisma/client";
import { prisma } from "@/database/prisma";
import { z } from "zod";
import { AppError } from "@/utils/AppError";
import { hash } from "bcrypt";

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

    const userWithEmailExists = await prisma.user.findFirst({
      where: { email },
    });

    if (userWithEmailExists) {
      throw new AppError("User with this email already exists");
    }

    const hashedPassword = await hash(password, 8);

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json();
  }
}

export { UsersController };
