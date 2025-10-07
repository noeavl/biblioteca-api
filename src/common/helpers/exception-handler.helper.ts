import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class ExceptionHandlerHelper {
  handleExceptions(error: unknown, entityName = 'Entity') {
    if (error && typeof error === 'object' && 'code' in error) {
      const mongoError = error as {
        code: number;
        keyValue?: Record<string, any>;
      };
      if (mongoError.code === 11000) {
        throw new BadRequestException(
          `${entityName} already exists ${JSON.stringify(mongoError.keyValue)}`,
        );
      }
      throw new InternalServerErrorException(
        'Internal Server Error - Check Logs',
      );
    }
    throw error;
  }
}
