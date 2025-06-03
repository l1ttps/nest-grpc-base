import { BadRequestException, Injectable } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import { packageObjectHelper } from 'grpc-js-reflection-client';
import { GrpcServiceMethod } from 'src/types/type';
import { Request } from 'express';
import { Metadata } from '@grpc/grpc-js';
import { convertKeysToCamelCase } from 'src/helper/snakeToCamel';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class GrpcProxyService {
  constructor(private configService: ConfigService) {}
  private grpcReflectionInstance = {};
  /**
   * HTTP to gRPC bridge.
   *
   * This method takes an Express `Request` and data as an argument, determines
   * the gRPC package, service, and method to call, and calls the
   * corresponding gRPC method. The method returns a Promise that resolves to
   * the data returned by the gRPC method with all keys converted to camelCase.
   *
   * @param req An Express `Request` object.
   * @param data The data to pass to the gRPC method.
   * @returns A Promise that resolves to the data returned by the gRPC method.
   * @throws A `BadRequestException` if the gRPC method throws an error.
   */
  public async httpToGrpc(req: Request, data: any) {
    const grpcMetadata = new Metadata();
    const { packageName, service, method } = this.getServiceMethod(req);
    const grpcReflectionServer = `0.0.0.0:${this.configService.get('PORT', 3000)}`;
    const packageObject = await packageObjectHelper({
      credentials: grpc.ChannelCredentials.createInsecure(),
      host: grpcReflectionServer,
      proto_symbol: `${packageName}.${service}`,
      protoLoaderOptions: {
        keepCase: false,
        longs: String,
        json: true,
        enums: String,
        arrays: true,
        defaults: true,
        objects: true,
        preferTrailingComment: false,
      },
    });

    const [protoName, version] = packageName.split('.');
    this.grpcReflectionInstance[packageName] = new packageObject[protoName][
      version
    ][service](grpcReflectionServer, grpc.ChannelCredentials.createInsecure());

    try {
      const result = await new Promise((resolve, reject) => {
        this.grpcReflectionInstance[packageName][method](
          data,
          grpcMetadata,
          (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(convertKeysToCamelCase(data));
            }
          },
        );
      });
      return result;
    } catch (err) {
      throw new BadRequestException(err.details);
    }
  }

  /**
   * Extracts the gRPC service method details from the request URL.
   * The URL is expected to follow the format: /{packageName}/{service}/{method}.
   * Strips away any query parameters and leading slashes before processing.
   * Splits the path into parts and assigns them to packageName, service, and method
   * in the GrpcServiceMethod object.
   *
   * @param req - The incoming HTTP request object.
   * @returns An object containing the package name, service name, and method name.
   */

  private getServiceMethod(req: Request): GrpcServiceMethod {
    const { originalUrl } = req;
    const result: GrpcServiceMethod = {
      packageName: '',
      service: '',
      method: '',
    };

    // Remove query params and leading slash
    const path = originalUrl.split('?')[0].replace(/^\/+/, '');

    const parts = path.split('/');

    if (parts.length === 3) {
      result.packageName = parts[0];
      result.service = parts[1];
      result.method = parts[2];
    }

    return result;
  }
}
