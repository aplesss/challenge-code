import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { KafkaService } from 'src/kafka/kafka.service';
import { CreateScoreEvent } from 'src/utiils';
import { ILeaderBoard, IUserScore } from 'src/types/Response';

@Injectable()
export class ScoreService {
  private readonly LEADER_BOARD_PREFIX = 'leaderboard-';

  constructor(
    private readonly redisService: RedisService,
    private readonly kafkaService: KafkaService,
  ) {}

  async addUser(id: string, userName: string): Promise<void> {
    await this.redisService.addZSetScore(
      `${this.LEADER_BOARD_PREFIX}${id}`,
      userName,
      0,
    );
  }

  async addScore(id: string, userName: string, score: number): Promise<void> {
    await this.redisService.increaseZSetScore(
      `${this.LEADER_BOARD_PREFIX}${id}`,
      userName,
      score,
    );
    const leaderboard = await this.getLeaderBoard(id);
    const event = CreateScoreEvent(id, leaderboard);
    await this.kafkaService.sendRealtimeEvent(event);
  }

  async getLeaderBoard(id: string): Promise<ILeaderBoard> {
    const scores: IUserScore[] = [];
    const members = await this.redisService.getZSet(
      `${this.LEADER_BOARD_PREFIX}${id}`,
      0,
      -1,
    );

    if (members) {
      for (const member of members) {
        const score = await this.redisService.getScore(
          `${this.LEADER_BOARD_PREFIX}${id}`,
          member,
        );
        if (score !== null) {
          scores.push({
            userName: member,
            score: Math.floor(Number.parseInt(`${score}`, 10)),
          });
        }
      }
    }

    return { leaderboard: scores };
  }
}
