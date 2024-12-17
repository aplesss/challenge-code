import { Module } from '@nestjs/common';

import { RedisModule } from 'src/redis/redis.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { ScoreService } from './score.service';

@Module({
  imports: [RedisModule, KafkaModule],
  providers: [ScoreService],
  exports: [ScoreService],
})
export class ScoreModule {}
