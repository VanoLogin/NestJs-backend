// app.module.ts
import { MongooseModule } from "@nestjs/mongoose";
import { SuperheroModule } from "./superheroes/superhero.module"; // Допустим, у тебя есть модуль для работы с MongoDB
import { UserModule } from "./users/users.module";
import "dotenv/config"; // Загружаем переменные окружения из .env
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { Logger, Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggingInterceptor } from "./interceptors/logging.interceptor"; // Создадим ниже

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Загружаем .env-файл
    TypeOrmModule.forRoot({
      type: "postgres",
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false, // Этот параметр позволяет принимать сертификаты
      },
      entities: [__dirname + "/**/*.entity{.ts,.js}"], // Указываем путь к сущностям
      synchronize: false, // Для разработки можно оставить включенным
      logging: true,
    }),

    MongooseModule.forRoot(
      `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}/${process.env.MONGODB_DB}?retryWrites=true&w=majority`
    ),

    UserModule,
    SuperheroModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor, // Логгирование запросов
    },
    Logger,
  ],
})
export class AppModule {}
