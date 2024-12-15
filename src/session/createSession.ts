import { JwtService } from "@nestjs/jwt";
import { randomBytes } from "crypto";
import { User } from "src/db/models/user.entity";

export function createSession(user: User, jwtService: JwtService) {
  const refreshToken = randomBytes(30).toString("base64");
  // Генерируем accessToken с данными пользователя
  const accessToken = jwtService.sign(
    { id: user.id, username: user.username, email: user.email }
    // { expiresIn: parseInt(process.env.ACCESS_TOKEN_TTL) }
  );

  return {
    accessToken,
    refreshToken,

    accessTokenValidUntil: new Date(
      Date.now() + parseInt(process.env.ACCESS_TOKEN_TTL)
    ),
    refreshTokenValidUntil: new Date(
      Date.now() + parseInt(process.env.REFRESH_TOKEN_TTL)
    ),
  };
}
