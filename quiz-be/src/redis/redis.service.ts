import { Inject, Injectable } from '@nestjs/common';

import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private static readonly EXPIRED_TIME_IN_SECONDS = 300;

  constructor(
    @Inject('REDIS')
    private readonly redisClient: Redis,
  ) {}

  async deleteValue(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async keyExists(key: string): Promise<boolean> {
    return Boolean(await this.redisClient.exists(key));
  }

  async getTTL(key: string): Promise<number> {
    return await this.redisClient.ttl(key);
  }

  async setValue(key: string, value: string): Promise<void> {
    await this.redisClient.set(key, value);
    await this.redisClient.expire(key, RedisService.EXPIRED_TIME_IN_SECONDS);
  }

  async setValueWithExpire(
    key: string,
    value: string,
    seconds: number,
  ): Promise<void> {
    await this.redisClient.set(key, value);
    await this.redisClient.expire(key, seconds);
  }

  async getValue(key: string): Promise<string | null> {
    const value = await this.redisClient.get(key);
    return value ?? null;
  }

  async addToList(key: string, value: string): Promise<void> {
    await this.redisClient.rpush(key, value);
    await this.redisClient.expire(key, RedisService.EXPIRED_TIME_IN_SECONDS);
  }

  async getList(key: string): Promise<string[]> {
    return await this.redisClient.lrange(key, 0, -1);
  }

  async isElementInList(key: string, value: string): Promise<boolean> {
    const list = await this.redisClient.lrange(key, 0, -1);
    return list.includes(value);
  }

  async addZSetScore(
    leaderboardKey: string,
    username: string,
    score: number,
  ): Promise<void> {
    await this.redisClient.zadd(leaderboardKey, score, username);
    await this.redisClient.expire(
      leaderboardKey,
      RedisService.EXPIRED_TIME_IN_SECONDS,
    );
  }

  async increaseZSetScore(
    leaderboardKey: string,
    username: string,
    score: number,
  ): Promise<void> {
    await this.redisClient.zincrby(leaderboardKey, score, username);
    await this.redisClient.expire(
      leaderboardKey,
      RedisService.EXPIRED_TIME_IN_SECONDS,
    );
  }

  async getZSet(
    leaderboardKey: string,
    start: number,
    end: number,
  ): Promise<string[]> {
    return await this.redisClient.zrevrange(leaderboardKey, start, end);
  }

  async getScore(
    leaderboardKey: string,
    username: string,
  ): Promise<number | string | null> {
    return await this.redisClient.zscore(leaderboardKey, username);
  }

  async setHashValue(
    hashName: string,
    key: string,
    value: number,
  ): Promise<void> {
    await this.redisClient.hset(hashName, key, value);
  }

  async getHashValue(
    hashName: string,
    key: string,
  ): Promise<number | string | null> {
    return await this.redisClient.hget(hashName, key);
  }
}
