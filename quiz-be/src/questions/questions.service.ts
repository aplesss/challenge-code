import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/questions.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  async findAll(): Promise<Question[]> {
    return this.questionsRepository.find();
  }

  //   async findOne(id: string): Promise<Question> {
  //     return this.questionsRepository.findOne(id);
  //   }

  async create(question: Partial<Question>): Promise<Question> {
    const newQuestion = this.questionsRepository.create(question);
    return this.questionsRepository.save(newQuestion);
  }
}
