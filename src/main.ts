import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "dotenv/config";
import pino from "pino";
import * as cookieParser from "cookie-parser";
// import { AllExceptionsFilter } from "./filters/all-exceptions.filter";
import { Logger, ValidationPipe } from "@nestjs/common";
async function bootstrap() {
  // Создаем экземпляр Pino

  // ВАРИАНТ 1 для логов
  // const pinoLogger = pino({
  //   transport: {
  //     target: "pino-pretty", // Для форматирования логов в читаемый формат
  //     options: {
  //       colorize: true, // Раскраска логов
  //       translateTime: "HH:MM:ss Z", // Формат времени
  //       ignore: "pid,hostname", // Игнорируем ненужные поля
  //     },
  //   },
  // });
  // const app = await NestFactory.create(AppModule, {
  //   logger: {
  //     log: (message) => pinoLogger.info(message),
  //     error: (message) => pinoLogger.error(message),
  //     warn: (message) => pinoLogger.warn(message),
  //     debug: (message) => pinoLogger.debug(message),
  //     verbose: (message) => pinoLogger.trace(message),
  //   },
  // });

  // ВАРИНАТ 2
  const app = await NestFactory.create(AppModule, {
    logger: ["log", "error", "warn", "debug", "verbose"], // Включаем уровни логгирования
  });
  await app.listen(process.env.PORT ?? 3000);

  const logger = new Logger("Bootstrap");
  logger.log(`Application is running on: http://localhost:${process.env.PORT}`);

  //utils
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());
}
bootstrap();
