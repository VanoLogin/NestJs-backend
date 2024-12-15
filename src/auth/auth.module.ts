import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UserModule } from "src/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session } from "src/db/models/session.entity";
import { JwtModule } from "@nestjs/jwt";
@Module({
  imports: [
    TypeOrmModule.forFeature([Session]), // Регистрируем сущность Session
    UserModule, // Импортируем UserModule для работы с UserService
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET, // Убедитесь, что секретный ключ определен в .env
      signOptions: { expiresIn: parseInt(process.env.ACCESS_TOKEN_TTL) }, // Настройте TTL токена
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule], // Экспортируем AuthService, если он потребуется в других модулях
})
export class AuthModule {}
