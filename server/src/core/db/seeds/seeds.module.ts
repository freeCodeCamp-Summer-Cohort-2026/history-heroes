import { Module } from '@nestjs/common';
import { SeedsService } from './seeds.service';

@Module({
  providers: [SeedsService],
  exports: [SeedsService],
})
export class SeedsModule {}
