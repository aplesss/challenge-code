import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Option } from './entities/options.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OptionsService {
  constructor(
    @InjectRepository(Option)
    private readonly optionRepository: Repository<Option>,
  ) {}

  async findAll() {
    const options = await this.optionRepository.find();
    return options.map((opt) => ({
      id: opt.id.toString(),
      title: opt.option_text,
      isCorrect: opt.is_correct,
      createdAt: opt.created_at,
    }));
  }

  findOne(id: number) {
    return `This action returns a #${id} option`;
  }
}
