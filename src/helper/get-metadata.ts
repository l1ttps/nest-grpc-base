import { Metadata } from '@grpc/grpc-js';

export function getMetadata(metadata: Metadata): any {
  const result: any = {};
  metadata.getMap();

  const map = metadata.getMap();

  for (const key in map) {
    const value = map[key];
    result[key] = typeof value === 'string' ? value : value.toString();
  }

  return result;
}
