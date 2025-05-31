import { Module } from '@nestjs/common';
import { CombineModule } from './modules/combine.module';
import { GrpcProxyModule } from './grpc-proxy/grpc-proxy.module';

@Module({
  imports: [CombineModule, GrpcProxyModule],
})
export class AppModule {}
