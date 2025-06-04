import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ReflectionService } from '@grpc/reflection';
import { HELLO_V1_PACKAGE_NAME } from './types/proto/hello';
import { GrpcProxyModule } from './grpc-proxy/grpc-proxy.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const PORT_GRPC = process.env.PORT_GRPC || 50051;
  const grpcProxy = await NestFactory.create(GrpcProxyModule);
  const grpcApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: HELLO_V1_PACKAGE_NAME,
        protoPath: join(__dirname, './proto/hello.proto'),
        url: `0.0.0.0:${PORT_GRPC}`,
        onLoadPackageDefinition(pkg, server) {
          new ReflectionService(pkg).addToServer(server);
        },
      },
    },
  );

  const config = new DocumentBuilder()
    .setTitle('Nest Grpc Gateway')
    .setDescription('The Nest Grpc Gateway API description')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(grpcProxy, config);
  SwaggerModule.setup('api', grpcProxy, documentFactory);
  await grpcProxy.listen(PORT);
  await grpcApp.listen();
  const logger = new Logger();
  logger.log(`🚀 Application is running on port ${PORT} and ${PORT_GRPC}`);
}
bootstrap();
