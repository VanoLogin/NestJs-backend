import {
  // BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
// import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { Session } from "src/db/models/session.entity"; // Ваша сущность для сессий
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException("Authorization header missing");
      }

      const [bearer, token] = authHeader.split(" ");
      if (bearer !== "Bearer" || !token) {
        throw new UnauthorizedException("Invalid token format");
      }
      // Проверяем JWT-токен
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_SECRET,
      });
      // Проверяем сессию в базе данных
      const session = await this.sessionRepository.findOne({
        where: {
          accessToken: token,
          user: { id: decodedToken.id }, // Убедимся, что сессия связана с этим пользователем
        },
      });

      if (!session) {
        throw new UnauthorizedException("Session not found or expired");
      }
      // Дополнительно можно проверить время жизни сессии
      if (new Date() > new Date(session.accessTokenValidUntil)) {
        throw new UnauthorizedException("Access token is expired");
      }

      req.user = decodedToken; // Добавляем пользователя в request для дальнейшего использования
      return true;
    } catch (error) {
      throw new UnauthorizedException({
        message: `${error.message}`,
      });
    }
  }
}
