import { Module } from '@nestjs/common';
import { ExamService } from './exam.service';
import { ExamController } from './exam.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './entities/exam.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exam])],
  providers: [ExamService],
  exports: [ExamService],
  controllers: [ExamController]
})
export class ExamModule {}
