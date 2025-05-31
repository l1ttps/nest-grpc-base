import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { GrpcProxyService } from './grpc-proxy.service';
import { Request } from 'express';

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

  @Post('*')
  httpToGrpc(@Req() req: Request, @Body() data) {
    return this.grpcProxyService.httpToGrpc(req, data);
  }
}
