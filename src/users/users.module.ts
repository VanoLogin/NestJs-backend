import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./users.controller";
import { UserService } from "./users.service";
import { User } from "../db/models/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { Session } from "src/db/models/session.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Session]), JwtModule], // Здесь регистрируем сущности
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
