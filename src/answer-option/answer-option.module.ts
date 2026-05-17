import { Module } from '@nestjs/common';
import { AnswerOptionService } from './answer-option.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerOption } from './entities/answer-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnswerOption])],
  providers: [AnswerOptionService],
  exports: [AnswerOptionService]
})
export class AnswerOptionModule {}
