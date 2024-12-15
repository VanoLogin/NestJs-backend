import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // Если ошибка - это HttpException
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const errorResponse = exception.getResponse();

      return response.status(status).json({
        statusCode: status,
        message: errorResponse["message"] || errorResponse || "Unknown error",
        error: exception.name,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    // Обработка других ошибок
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    return response.status(status).json({
      statusCode: status,
      message: "Internal server error",
      error: exception instanceof Error ? exception.message : exception,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
