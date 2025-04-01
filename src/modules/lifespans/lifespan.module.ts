import { Module } from '@nestjs/common';
import { LifespanService } from './lifespan.service';

@Module({
  providers: [LifespanService],
  exports: [LifespanService],
})
export class LifespansModule {}
