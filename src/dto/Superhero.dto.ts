import { IsString, IsOptional, IsNotEmpty } from "class-validator"; // Для валидации входных данных

export class SuperHeroDto {
  @IsString()
  @IsNotEmpty()
  readonly nickname: string; // Псевдоним супергероя

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly realname: string; // Реальное имя (опционально)

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly originDescription: string; // Описание происхождения (опционально)

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly superpowers: string; // Суперспособности (опционально)

  @IsOptional()
  @IsString()
  readonly image?: string; // Изображение супергероя (опционально)

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly catchPhrase: string; // Лозунг (опционально)
}

export class UpdateSuperHeroDto {
  @IsOptional()
  @IsString()
  readonly nickname?: string;

  @IsOptional()
  @IsString()
  readonly realname?: string;

  @IsOptional()
  @IsString()
  readonly originDescription?: string;

  @IsOptional()
  @IsString()
  readonly superpowers?: string;

  @IsOptional()
  @IsString()
  readonly image?: string;

  @IsOptional()
  @IsString()
  readonly catchPhrase?: string;
}
