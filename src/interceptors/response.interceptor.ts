import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // Обрабатываем успешный ответ
        return {
          statusCode: HttpStatus.CREATED, // Стандартный статус
          message: "Request was successful", // Стандартное сообщение
          data, // Данные ответа
        };
      })
    );
  }
}
