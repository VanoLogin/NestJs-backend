import { DataSource } from "typeorm";
import { User } from "./db/models/user.entity";
import "dotenv/config";
import { Session } from "./db/models/session.entity";

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: [User, Session],
  migrations: [__dirname + "/migrations/**/*{.ts,.js}"],
  synchronize: false,
  logging: true,
});

export default AppDataSource; // Обязательно!
