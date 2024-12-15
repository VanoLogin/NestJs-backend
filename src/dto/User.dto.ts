import { Gender } from "src/Constants/Decorators/Gender.enum";
import { IsEmail, IsNotEmpty, Length } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @Length(3, 20)
  username: string;
  @IsNotEmpty()
  @Length(8, 30)
  password: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  ip_address?: string;
  gender?: Gender;
}
