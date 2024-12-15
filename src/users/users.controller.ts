import {
  Controller,
  Get,
  Post,
  Body,
  UseFilters,
  UseInterceptors,
  UseGuards,
} from "@nestjs/common";
import { UserService } from "./users.service";
import { CreateUserDto } from "../dto/User.dto";
import { User } from "../db/models/user.entity";
import { AllExceptionsFilter } from "../filters/all-exceptions.filter";
import { ResponseInterceptor } from "src/interceptors/response.interceptor";
import { QueryExceptionFilter } from "src/filters/postQuery-exceptions";
import { SessionAuthGuard } from "src/Gards/jwtAuthGard";
// import { UserExistsGuard } from "src/Gards/existingUserGard";

@UseGuards(SessionAuthGuard)
@UseFilters(AllExceptionsFilter) // Глобальный фильтр для этого контроллера выброс ошибки
@UseInterceptors(ResponseInterceptor) // Глобальный интерцептор для обработки ответа
@Controller("users")
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @UseFilters(QueryExceptionFilter)
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto); // Метод для создания пользователя
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll(); // Метод для получения всех пользователей
  }
}
