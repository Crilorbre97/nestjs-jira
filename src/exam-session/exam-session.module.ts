import { Module } from '@nestjs/common';
import { ExamSessionService } from './exam-session.service';
import { ExamSessionController } from './exam-session.controller';
import { ExamSession } from './entities/exam-session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamService } from 'src/exam/exam.service';
import { Exam } from 'src/exam/entities/exam.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExamSession, Exam])],
  providers: [ExamSessionService, ExamService],
  exports: [ExamSessionService, ExamService],
  controllers: [ExamSessionController]
})
export class ExamSessionModule {}
