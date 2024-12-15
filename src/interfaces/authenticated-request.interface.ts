import { Request } from "express";
import { User } from "src/db/models/user.entity";

export interface AuthenticatedRequest extends Request {
  user: User; // Поле user будет добавлено в объект запроса
}
