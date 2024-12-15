import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { Types } from "mongoose";

@Injectable()
export class ValidateIdPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Проверяем, что данный пайп применяется только к параметру с именем "param"
    if (metadata.type !== "param") {
      return value; // Возвращаем значение без обработки
    }
    // Проверяем, что ID не пустой
    if (!value) {
      throw new BadRequestException("ID parameter is required");
    }

    // Проверяем, что ID является валидным ObjectId MongoDB
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(
        "ID parameter must be a valid MongoDB ObjectId"
      );
    }

    return value;
  }
}
