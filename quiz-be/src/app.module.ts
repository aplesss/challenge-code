import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QuizModule } from './quiz/quiz.module';
import { getConfigDatabase } from './config';
import { RedisModule } from './redis/redis.module';
import { OptionsModule } from './options/options.module';
import { QuestionsModule } from './questions/questions.module';
import { KafkaModule } from './kafka/kafka.module';
import { ScoreModule } from './score/score.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => getConfigDatabase(config),
      inject: [ConfigService],
    }),
    RedisModule,
    KafkaModule,
    QuizModule,
    OptionsModule,
    QuestionsModule,
    ScoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
