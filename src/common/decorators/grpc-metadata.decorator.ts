import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';
import { plainToInstance } from 'class-transformer';
import { validateSync, getMetadataStorage } from 'class-validator';
import { GrpcMetadataDto } from '../dto/grpc-metadata.dto';
import { RpcException } from '@nestjs/microservices';

export const GrpcMetadata = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const metadata: Metadata = ctx.getArgByIndex(1);

    const metadataObj: Record<string, any> = metadata.getMap();

    const instance = plainToInstance(GrpcMetadataDto, metadataObj);

    const hasValidationRules =
      getMetadataStorage().getTargetValidationMetadatas(
        GrpcMetadataDto,
        '',
        false,
        false,
      ).length > 0;

    if (hasValidationRules) {
      const errors = validateSync(instance);
      if (errors.length > 0) {
        throw new RpcException({
          message: 'Invalid gRPC metadata',
          errors: errors.map((e) => ({
            property: e.property,
            constraints: e.constraints,
          })),
        });
      }
    }

    return instance;
  },
);
