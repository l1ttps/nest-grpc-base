import { Controller } from '@nestjs/common';
import { HelloService } from './hello.service';
import {
  GREETER_SERVICE_NAME,
  HelloRequest,
  HelloResponse,
} from 'src/types/proto/hello';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcMetadata } from 'src/common/decorators/grpc-metadata.decorator';
import { GrpcPayload } from 'src/common/decorators/grpc-payload.decorator';

export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @GrpcMethod(GREETER_SERVICE_NAME)
  sayHello(
    @GrpcPayload() payload: HelloRequest,
    @GrpcMetadata() metadata: any,
  ): HelloResponse {
    const { name } = payload;
    return {
      message: `Hello ${name}`,
    };
  }
}
