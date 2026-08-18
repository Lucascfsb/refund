import { verify } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { authConfig } from "@/configs/auth";
import { AppError } from "@/utils/AppError";

interface TokenPayload {
  role: string;
  sub: string;
}

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("JWT token is missing", 401);
    }

    const [, token] = authHeader.split(" ");

    const { role, sub: userId } = verify(
      token,
      authConfig.jwt.secret,
    ) as TokenPayload;

    req.user = {
      id: userId,
      role,
    };

    return next();
  } catch (error) {
    throw new AppError("Invalid JWT token", 401);
  }
}

export { ensureAuthenticated };
