import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ReflectionService } from '@grpc/reflection';
import { HELLO_V1_PACKAGE_NAME } from './types/proto/hello';
import { GrpcProxyModule } from './grpc-proxy/grpc-proxy.module';
import { PORT } from './configs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const grpcProxy = await NestFactory.create(GrpcProxyModule);
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: HELLO_V1_PACKAGE_NAME,
        protoPath: join(__dirname, './proto/hello.proto'),
        url: `0.0.0.0:${PORT}`,
        onLoadPackageDefinition(pkg, server) {
          new ReflectionService(pkg).addToServer(server);
        },
      },
    },
  );
  await grpcProxy.listen(PORT);
  await grpcApp.listen();
  const logger = new Logger();
  logger.log(`🚀 Application is running on port ${PORT}`);
}
bootstrap();
