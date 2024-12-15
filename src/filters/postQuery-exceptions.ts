import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from "@nestjs/common";
import { QueryFailedError } from "typeorm";
import { Response } from "express";
//Для большего контроля можно определить интерфейс для PostgreSQL-ошибок:
interface PostgresError extends Error {
  code?: string;
}

@Catch(QueryFailedError)
export class QueryExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const driverError = exception.driverError as PostgresError; // Используем наш интерфейс
    const status =
      driverError.code === "23505"
        ? HttpStatus.CONFLICT // Уникальное ограничение
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message:
        driverError.code === "23505"
          ? "Duplicate entry: Username or email already exists"
          : driverError.code === "23503"
            ? "Foreign key constraint violated"
            : "Database error",
      error: exception.message,
    });
  }
}
/*Предназначение:

	•	Этот фильтр предназначен для обработки ошибок базы данных, выбрасываемых TypeORM (ошибки типа QueryFailedError).
	•	Пример использования:
	•	Когда вы сохраняете данные в PostgreSQL, и нарушается ограничение уникальности (code === "23505"), этот фильтр возвращает понятное сообщение: "Duplicate entry: Username or email already exists".
	•	Для других ошибок возвращается стандартное сообщение "Database error".

Как работает:

	•	Ловит исключения типа QueryFailedError.
	•	Проверяет код ошибки базы данных:
	•	Если код 23505 (конфликт уникальности) — возвращает статус 409 Conflict.
	•	Для всех остальных ошибок возвращает статус 500 Internal Server Error.
	•	Отправляет клиенту структурированный JSON-ответ с описанием ошибки.

  */
