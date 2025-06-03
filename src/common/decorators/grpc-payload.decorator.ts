import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

export function GrpcPayload<T>(dtoClass?: new () => T) {
  if (!dtoClass) {
    return createParamDecorator((_, ctx: ExecutionContext) => {
      const payload = ctx.getArgByIndex(0);
      return payload;
    })();
  }
  return createParamDecorator((_, ctx: ExecutionContext) => {
    const payload = ctx.getArgByIndex(0);
    const transformed = plainToInstance(dtoClass, payload);
    const errors = validateSync(transformed as object);

    if (errors.length > 0) {
      const message = errors
        .map((err) => Object.values(err.constraints || {}).join(', '))
        .join('; ');
      throw new RpcException({
        message,
        code: status.INVALID_ARGUMENT,
      });
    }

    return transformed;
  })();
}
