// kafka.service.ts
import { Injectable } from '@nestjs/common';
import { Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { IBaseEventDto, IRealtimeEventDto } from 'src/types/IDTO';

const KAFKA_TOPIC = process.env.KAFKA_TOPIC;

@Injectable()
export class KafkaService {
  private readonly logger = new Logger(KafkaService.name);

  constructor(
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka, // Inject the Kafka client
  ) {}

  // Method to send a message
  async sendMessage(message: string): Promise<void> {
    try {
      await this.kafkaClient.emit(KAFKA_TOPIC, message); // KAFKA_TOPIC should be replaced with your Kafka topic
    } catch (error) {
      this.logger.error(
        `Failed to send message: ${error.message}`,
        error.stack,
      );
    }
  }

  // Method to send a RealtimeEventDto
  async sendRealtimeEvent(
    dto: IRealtimeEventDto<IBaseEventDto>,
  ): Promise<void> {
    try {
      const message = this.toJson(dto);
      if (message) {
        await this.kafkaClient.emit(KAFKA_TOPIC, message);
      }
    } catch (error) {
      this.logger.error(
        `Failed to send RealtimeEventDto: ${error.message}`,
        error.stack,
      );
    }
  }

  // Helper method to convert an object to JSON
  private toJson(object: any): string | null {
    try {
      return JSON.stringify(object);
    } catch (error) {
      this.logger.error('Failed to convert object to JSON', error.stack);
      return null;
    }
  }
}
