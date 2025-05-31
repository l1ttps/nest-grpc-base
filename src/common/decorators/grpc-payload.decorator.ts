import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GrpcPayload = createParamDecorator((_, ctx: ExecutionContext) => {
  return ctx.getArgByIndex(0);
});
