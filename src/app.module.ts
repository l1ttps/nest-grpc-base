import { Module } from '@nestjs/common';
import { CombineModule } from './modules/combine.module';
import { GrpcProxyModule } from './grpc-proxy/grpc-proxy.module';
import { ConfigModule } from '@nestjs/config';
import { envModuleConfig } from './configs/config';

@Module({
  imports: [
    ConfigModule.forRoot(envModuleConfig),
    CombineModule,
    GrpcProxyModule,
  ],
})
export class AppModule {}
