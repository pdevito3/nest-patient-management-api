import { Module } from '@nestjs/common';
import { SexService } from './sex.service';

@Module({
  providers: [SexService],
  exports: [SexService],
})
export class SexesModule {}
