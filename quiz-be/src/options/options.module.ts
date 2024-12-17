import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Option } from './entities/options.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Option])],
  providers: [OptionsService],
})
export class OptionsModule {}
