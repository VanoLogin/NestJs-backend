import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import "dotenv/config";
import * as cookieParser from "cookie-parser";
// import { AllExceptionsFilter } from "./filters/all-exceptions.filter";
import { Logger, ValidationPipe } from "@nestjs/common";
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["log", "error", "warn", "debug", "verbose"], // Включаем уровни логгирования
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);

  const logger = new Logger("Bootstrap");
  logger.log(`Application is running on: http://localhost:${process.env.PORT}`);
}
bootstrap();
