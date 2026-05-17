import { Module } from '@nestjs/common';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './entities/answer.entity';
import { ExamSessionModule } from 'src/exam-session/exam-session.module';
import { QuestionModule } from 'src/question/question.module';
import { AnswerOptionModule } from 'src/answer-option/answer-option.module';

@Module({
  imports: [TypeOrmModule.forFeature([Answer]), ExamSessionModule, QuestionModule, AnswerOptionModule],
  providers: [AnswerService],
  controllers: [AnswerController]
})
export class AnswerModule {}
