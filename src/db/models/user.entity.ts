import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Session } from "./session.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: "inet", nullable: true })
  ip_address: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @OneToMany(() => Session, (session) => session.user) // Связь с таблицей Session
  sessions: Session[];
}
