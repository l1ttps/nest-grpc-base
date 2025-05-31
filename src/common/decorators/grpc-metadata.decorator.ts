import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';
import { getMetadata } from 'src/helper/get-metadata';

export const GrpcMetadata = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const metadata: Metadata = ctx.getArgByIndex(1);
    return getMetadata(metadata);
  },
);
