import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Session {
  @PrimaryGeneratedColumn("uuid") // Генерация UUID
  id: string;

  @Column({ type: "varchar", unique: true }) // Уникальный refreshToken
  refreshToken: string;

  @Column({ type: "varchar", unique: true })
  accessToken: string;

  @Column({ type: "timestamp" }) // Дата истечения refreshToken
  refreshTokenValidUntil: Date;

  @Column({ type: "timestamp" }) // Дата истечения accessToken
  accessTokenValidUntil: Date;

  @ManyToOne(() => User, (user) => user.sessions, {
    eager: true,
    onDelete: "CASCADE",
  }) // Удаление сессии, если пользователь удален
  user: User;
}
