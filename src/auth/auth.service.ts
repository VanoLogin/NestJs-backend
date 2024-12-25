import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Session } from "src/db/models/session.entity";
import { Repository } from "typeorm";
import { createSession } from "src/session/createSession";
import { User } from "src/db/models/user.entity";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly jwtService: JwtService
  ) {}

  async login(user: User): Promise<Session> {
    // Удаляем предыдущие сессии пользователя
    await this.sessionRepository.delete({ user: { id: user.id } });

    // Создаем новую сессию
    const newSession = createSession(user, this.jwtService);

    // Сохраняем сессию в базе данных
    const session = this.sessionRepository.create({
      ...newSession,
      user,
    });
    return await this.sessionRepository.save(session);
  }

  async refresh(sessionId: string, refreshToken: string): Promise<Session> {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken, id: sessionId },
    });
    console.log("Found session:", session);
    if (session === null) {
      throw new NotFoundException(401, "Session not found");
    }

    const isSessionTokenExpired =
      new Date() > new Date(session.refreshTokenValidUntil);

    if (isSessionTokenExpired) {
      throw new NotFoundException(401, "Session refreshToken expired");
    }
    if (!session.user) {
      throw new NotFoundException("User not found in session");
    }
    // Создаем новую сессию
    const newSession = createSession(session.user, this.jwtService);
    // Удаляем старую сессию
    await this.sessionRepository.delete({ id: session.id });

    const savedSession = this.sessionRepository.create({
      ...newSession,
      user: session.user,
    });

    return await this.sessionRepository.save(savedSession);
  }
  async logout(sessionId: string, refreshToken: string): Promise<void> {
    const session = await this.sessionRepository.findOne({
      where: { refreshToken },
    });

    if (!session) {
      throw new NotFoundException("Session not found");
    }

    if (session.refreshToken !== refreshToken) {
      throw new NotFoundException("Invalid refresh token");
    }
    if (session.id !== sessionId) {
      throw new NotFoundException("Invalid session ID");
    }

    await this.sessionRepository.delete({
      id: sessionId,
      refreshToken: refreshToken,
    });
  }

  async googleLogin(req: Request) {
    if (!req.user) {
      throw new NotFoundException("In request we don't have a user");
    }
  }
}
