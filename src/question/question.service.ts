import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamService } from 'src/exam/exam.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionOption } from 'src/question-option/entities/question-option.entity';
import { QuestionOptionService } from 'src/question-option/question-option.service';

@Injectable()
export class QuestionService {
    constructor(@InjectRepository(Question) private questionRepository: Repository<Question>, private questionOptionService: QuestionOptionService, private examService: ExamService){}

    async findQuestionsByExam(examId: number): Promise<Question[]> {
        const exam = await this.examService.findOne(examId);

        if (!exam) {
            throw new NotFoundException(`Exam with ${examId} not found`)
        }

        return await this.questionRepository.find({ where: { exam: { id: examId } }, relations: ['questionOptions'] });
    }

    async createQuestion(examId: number, dto: CreateQuestionDto): Promise<Question> {
        const exam = await this.examService.findOne(examId);

        if (!exam) {
            throw new NotFoundException(`Exam with ${examId} not found`)
        }

        let questionsOptions: QuestionOption[] = [];

        if (dto.options && dto.questionType !== 'open_answer') {
            questionsOptions = dto.options.map(option => {
                return this.questionOptionService.newQuestionOption({ ...option })
            })
        }

        const { options, ...questionData } = dto;

        const question = this.questionRepository.create({ ...questionData, questionOptions: questionsOptions, exam: exam });
        return await this.questionRepository.save(question);
    }
}
