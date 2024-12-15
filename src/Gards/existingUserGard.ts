import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
} from "@nestjs/common";
import { UserService } from "../users/users.service";

@Injectable()
export class UserExistsGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest(); // Получаем объект запроса
    const userEmail = request.body.email; // Извлекаем email из body

    if (!userEmail) {
      throw new NotFoundException("User email is required"); // Проверяем наличие email
    }

    // Проверяем наличие пользователя в базе данных
    const userExists = await this.userService.findByEmail(userEmail);
    if (userExists) {
      throw new NotFoundException(`User with email: ${userEmail} exists`);
    }

    return true; // Если пользователь нет, продолжаем выполнение
  }
}
