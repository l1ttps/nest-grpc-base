import { ApiProperty } from '@nestjs/swagger';

export class GrpcProxyDto {}
export class HttpToGrpcParams {
  @ApiProperty({ example: 'hello.v1' })
  package: string;
  @ApiProperty({ example: 'Greeter' })
  service: string;
  @ApiProperty({ example: 'SayHello' })
  method: string;
}
