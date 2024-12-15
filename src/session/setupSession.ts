import { Response } from "express";
import { Session } from "src/db/models/session.entity"; // Импорт модели Session

export function setupSession(res: Response, session: Session): void {
  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    secure: true, // Убедитесь, что используется HTTPS
    sameSite: "strict", // Блокирует запросы с другого домена
    expires: session.refreshTokenValidUntil, // Срок действия токена
  });

  res.cookie("sessionId", session.id, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    expires: session.refreshTokenValidUntil,
  });
}
