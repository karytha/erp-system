import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret";

export type AuthPayload = { sub: string; email: string };

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, JWT_SECRET) as AuthPayload;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token ausente ou inválido" });
  }
  const token = header.slice(7);
  try {
    const payload = verifyToken(token);
    (req as Request & { user?: AuthPayload }).user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
