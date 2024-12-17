import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quiz } from './entities/quiz.entity';
import { RedisModule } from 'src/redis/redis.module';
import { KafkaModule } from 'src/kafka/kafka.module';
import { ScoreModule } from 'src/score/score.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Quiz]),
    RedisModule,
    KafkaModule,
    ScoreModule,
  ],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
