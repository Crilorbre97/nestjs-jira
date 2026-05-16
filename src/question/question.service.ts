import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ExamService } from '../exam/exam.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { QuestionOption } from 'src/question-option/entities/question-option.entity';
import { QuestionOptionService } from '../question-option/question-option.service';

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

    async findOne(id: number): Promise<Question> {
        const question = await this.questionRepository.findOne({ where: { id }, relations: ['questionOptions'] });

        if (!question) {
            throw new NotFoundException(`Question with ${id} not found`)
        }

        return question;
    }

    async createQuestion(examId: number, dto: CreateQuestionDto): Promise<Question> {
        const exam = await this.examService.findOne(examId);

        if (!exam) {
            throw new NotFoundException(`Exam with ${examId} not found`)
        }

        let questionsOptions: QuestionOption[] = [];

        if (dto.questionOptions && dto.questionType !== 'open_answer') {
            questionsOptions = dto.questionOptions.map(option => {
                return this.questionOptionService.newQuestionOption({ ...option })
            })
        }

        const { questionOptions, ...questionData } = dto;

        const question = this.questionRepository.create({ ...questionData, questionOptions: questionsOptions, exam: exam });
        return await this.questionRepository.save(question);
    }

    async deleteQuestion(id: number): Promise<void> {
        const question = await this.questionRepository.findOne({ where: { id } });

        if (!question) {
            throw new NotFoundException(`Question with ${id} not found`)
        }

        await this.questionRepository.remove(question);
    }
}
