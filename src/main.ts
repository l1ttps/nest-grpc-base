import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ReflectionService } from '@grpc/reflection';
import { HELLO_V1_PACKAGE_NAME } from './types/proto/hello';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: HELLO_V1_PACKAGE_NAME,
        protoPath: join(__dirname, './proto/hello.proto'),
        url: `0.0.0.0:50051`,
        onLoadPackageDefinition(pkg, server) {
          new ReflectionService(pkg).addToServer(server);
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
