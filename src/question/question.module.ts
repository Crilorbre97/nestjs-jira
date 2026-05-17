import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { ExamService } from 'src/exam/exam.service';
import { Exam } from 'src/exam/entities/exam.entity';
import { QuestionOption } from 'src/question-option/entities/question-option.entity';
import { QuestionOptionService } from 'src/question-option/question-option.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, QuestionOption, Exam])],
  providers: [QuestionService, QuestionOptionService, ExamService],
  exports: [QuestionService, QuestionOptionService, ExamService],
  controllers: [QuestionController]
})
export class QuestionModule {}
