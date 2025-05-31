import { Controller, Get } from '@nestjs/common';
import { GrpcProxyService } from './grpc-proxy.service';

@Controller()
export class GrpcProxyController {
  constructor(private readonly grpcProxyService: GrpcProxyService) {}

  @Get()
  getStatus() {
    return {
      type: 'GRPC_PROXY',
      message: 'OK',
    };
  }
}
