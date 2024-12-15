import {
  BadRequestException,
  // ConflictException,
  Injectable,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../db/models/user.entity";
import { CreateUserDto } from "../dto/User.dto";
import * as bcrypt from "bcrypt";
import validator from "validator";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Валидация email
    if (!validator.isEmail(createUserDto.email)) {
      throw new BadRequestException("Invalid email format");
    }

    // Проверка сложности пароля
    // if (!validator.isStrongPassword(createUserDto.password)) {
    //   throw new BadRequestException("Password is not strong enough");
    // }

    // Хеширование пароля
    const encryptedPassword = await bcrypt.hash(
      createUserDto.password,
      parseInt(process.env.SALT_ROUNDS, 10)
    );

    // Создание нового пользователя
    const user = this.usersRepository.create({
      ...createUserDto,
      password: encryptedPassword,
    });
    return this.usersRepository.save(user); // Ошибки уникальности будут обработаны базой и QueryExceptionFilter
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  // Метод для поиска пользователя по email
  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }
}
