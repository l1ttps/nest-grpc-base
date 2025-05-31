import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { GrpcProxyService } from './grpc-proxy.service';
import { Request } from 'express';
import { GrpcProxyDto, HttpToGrpcParams } from './grpc.proxy.dto';

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

  /**
   * http://localhost:3000/hello.v1/Greeter/sayHello
   * @param req
   * @param data
   * @returns
   */
  @Post(':package/:service/:method')
  httpToGrpc(
    @Req() req: Request,
    @Body() data: GrpcProxyDto,
    @Param() _: HttpToGrpcParams,
  ) {
    return this.grpcProxyService.httpToGrpc(req, data);
  }
}
