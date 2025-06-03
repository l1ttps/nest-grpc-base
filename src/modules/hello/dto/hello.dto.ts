import { IsString } from 'class-validator';

export class HelloRequestDto {
  @IsString()
  name: string;
}
