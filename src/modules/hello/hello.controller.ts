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
import { HelloRequestDto } from './dto/hello.dto';
import { GrpcMetadataDto } from 'src/common/dto/grpc-metadata.dto';

@Controller()
export class HelloController {
  constructor(private helloService: HelloService) {}

  @GrpcMethod(GREETER_SERVICE_NAME)
  sayHello(
    @GrpcPayload(HelloRequestDto) payload: HelloRequest,
    @GrpcMetadata() metadata: GrpcMetadataDto,
  ): HelloResponse {
    return this.helloService.sayHello(payload, metadata);
  }
}
