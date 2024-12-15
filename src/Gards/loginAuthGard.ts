import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "src/users/users.service";
import { validatePassword } from "src/validation/validatePassword";

@Injectable()
export class UserAuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email, password } = request.body;
    console.log(request.body, "gard");
    if (!email) {
      throw new NotFoundException("User email is required");
    }

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email: ${email} not found`);
    }

    const isPasswordValid = await validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    request.user = user; // Добавляем пользователя в request
    return true;
  }
}
