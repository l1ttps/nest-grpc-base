import { Module } from '@nestjs/common';
import { GrpcProxyService } from './grpc-proxy.service';
import { GrpcProxyController } from './grpc-proxy.controller';

@Module({
  controllers: [GrpcProxyController],
  providers: [GrpcProxyService],
})
export class GrpcProxyModule {}
