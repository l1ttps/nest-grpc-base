import { Injectable, Logger } from '@nestjs/common';
import { GrpcMetadataDto } from 'src/common/dto/grpc-metadata.dto';
import { HelloRequest } from 'src/types/proto/hello';

@Injectable()
export class HelloService {
  /**
   * Generates a greeting message using the provided payload and metadata.
   *
   * @param payload - The request payload containing the user's name.
   * @param metadata - The gRPC metadata associated with the request.
   * @returns An object containing a greeting message with the user's name and metadata.
   */

  public sayHello(payload: HelloRequest, metadata: GrpcMetadataDto) {
    const { name } = payload;
    Logger.log(`Metadata: ${JSON.stringify(metadata)}`);
    return {
      message: `Hello ${name}`,
    };
  }
}
