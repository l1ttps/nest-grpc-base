import { Module } from '@nestjs/common';
import { GrpcProxyService } from './grpc-proxy.service';
import { GrpcProxyController } from './grpc-proxy.controller';
import { ConfigModule } from '@nestjs/config';
import { envModuleConfig } from 'src/configs/config';

@Module({
  imports: [ConfigModule.forRoot(envModuleConfig)],
  controllers: [GrpcProxyController],
  providers: [GrpcProxyService],
})
export class GrpcProxyModule {}
