import { ValidationPipe, BadRequestException } from "@nestjs/common";

export const createValidationPipe = () => {
  return new ValidationPipe({
    transform: true, // Преобразует данные в объекты с нужным типом
    whitelist: true, // Очищает непредусмотренные поля
    forbidNonWhitelisted: true, // Генерирует ошибку, если есть лишние поля
    exceptionFactory: (errors) => {
      // Обрабатываем ошибки валидации
      const messages = errors.map((error) => {
        return `${error.property} has wrong value ${error.value}, ${Object.values(error.constraints).join(", ")}`;
      });
      return new BadRequestException(messages);
    },
  });
};
