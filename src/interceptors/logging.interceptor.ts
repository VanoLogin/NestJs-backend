import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const body = JSON.stringify(request.body);

    const now = Date.now();

    this.logger.log(`Request: ${method} ${url}, Body: ${body}`);

    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `Response for ${method} ${url} took ${Date.now() - now}ms`
          )
        )
      );
  }
}
/**Предназначение:

	•	Этот интерсептор отвечает за логгирование входящих запросов и исходящих ответов.
	•	Пример использования:
	•	Когда клиент отправляет запрос к API, логируется метод (GET, POST), URL и тело запроса.
	•	После обработки запроса логируется, сколько времени заняла обработка.

Как работает:

	1.	До обработки запроса:
	•	Получает объект запроса (method, url, body) и записывает это в лог.
	2.	После обработки запроса:
	•	Логирует, сколько времени заняла обработка (Date.now() - now).

Зачем это нужно:

	•	Для отладки и мониторинга. Логирование позволяет разработчику видеть:
	•	Какие запросы приходят.
	•	Как долго обрабатываются запросы.
	•	Какие данные отправляются в теле запросов. */
