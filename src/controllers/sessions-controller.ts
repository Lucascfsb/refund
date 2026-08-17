import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { authConfig } from "@/configs/auth";
import { sign, SignOptions } from "jsonwebtoken";
import { z } from "zod";
import { compare } from "bcrypt";
import { AppError } from "@/utils/AppError";

class SessionsController {
  async create(req: Request, res: Response) {
    const createSessionBodySchema = z.object({
      email: z.email("Invalid email address"),
      password: z.string().min(6),
    });

    const { email, password } = createSessionBodySchema.parse(req.body);

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new AppError("E-mail or password is incorrect", 404);
    }

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new AppError("E-mail or password is incorrect", 404);
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn: expiresIn as SignOptions["expiresIn"],
    });

    const {password: _, ...userWithoutPassword} = user;

    res.json({ token, user: userWithoutPassword });
  }
}

export { SessionsController };
