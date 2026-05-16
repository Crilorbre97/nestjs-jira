import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamSession } from './entities/exam-session.entity';
import { Repository } from 'typeorm';
import { ExamService } from 'src/exam/exam.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ExamSessionService {
    constructor(@InjectRepository(ExamSession) private examSessionRepository: Repository<ExamSession>, private examService: ExamService) {}

    async createExamSession(examId: number, user: User) {
        const exam = await this.examService.findOne(examId);

        if(!exam) {
            throw new NotFoundException(`Exam with id ${examId} not found`);
        }

        const newExamSession = this.examSessionRepository.create({ exam, isCompleted: false, user });
        return this.examSessionRepository.save(newExamSession);
    }
}
