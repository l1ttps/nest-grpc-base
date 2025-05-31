import { Module } from '@nestjs/common';
import { CombineModule } from './modules/combine.module';

@Module({
  imports: [CombineModule],
})
export class AppModule {}
