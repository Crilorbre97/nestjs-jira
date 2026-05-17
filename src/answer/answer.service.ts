import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Answer } from './entities/answer.entity';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { ExamSessionService } from 'src/exam-session/exam-session.service';
import { QuestionService } from 'src/question/question.service';
import { QuestionType } from 'src/question/entities/question.entity';
import { QuestionOption } from 'src/question-option/entities/question-option.entity';
import { AnswerOptionService } from 'src/answer-option/answer-option.service';

@Injectable()
export class AnswerService {
    constructor(@InjectRepository(Answer) private answerRepository: Repository<Answer>, private examSessionService: ExamSessionService, private questionService: QuestionService, private answerOptionService: AnswerOptionService) { }

    async createAnswer(examSessionId: number, questionId: number, dto: CreateAnswerDto) {
        const examSession = await this.examSessionService.findOne(examSessionId);
        if (!examSession) {
            throw new NotFoundException(`Exam session with id ${examSessionId} not found`);
        }

        const question = await this.questionService.findOne(questionId);
        if (!question) {
            throw new NotFoundException(`Question with id ${questionId} not found`);
        }

        const answer = this.answerRepository.create({
            examSession,
            question
        });

        if (question.questionType === QuestionType.OPEN_ANSWER) {
            this.manageOpenAnswer(dto, answer);
        } else if (question.questionType === QuestionType.ONE_CHOICE) {
            this.manageOneChoiceAnswer(dto, answer, question.questionOptions);
        } else if (question.questionType === QuestionType.MULTIPLE_CHOICE) {
            await this.manageMultipleChoiceAnswer(dto, answer, question.questionOptions);
        } else {
            throw new NotFoundException(`Unsupported question type ${question.questionType}`);
        }

        return this.answerRepository.save(answer);
    }

    private manageOpenAnswer(dto: CreateAnswerDto, answer: Answer): Answer {
        if (!dto.response) {
            throw new NotFoundException(`Response is required for open answer questions`);
        }

        answer.response = dto.response;
        return answer;
    }

    private manageOneChoiceAnswer(dto: CreateAnswerDto, answer: Answer, questionOptions: QuestionOption[]): Answer {
        if (!dto.answerOptions || dto.answerOptions.length === 0) {
            throw new NotFoundException(`At least one answer option must be selected for one choice questions`);
        } else if (dto.answerOptions.length > 1) {
            throw new NotFoundException(`Only one answer option can be selected for one choice questions`);
        }

        const optionId = dto.answerOptions[0].optionId;
        const questionOption = questionOptions.find(option => option.id === optionId);
        if (!questionOption) {
            throw new NotFoundException(`Question option with id ${optionId} not found in question options`);
        }

        const answerOption = this.answerOptionService.createAnswerOption(questionOption);
        answer.answerOption = [answerOption];
        return answer
    }

    private manageMultipleChoiceAnswer(dto: CreateAnswerDto, answer: Answer, questionOptions: QuestionOption[]): Answer {
        if (!dto.answerOptions || dto.answerOptions.length === 0) {
            throw new NotFoundException(`At least one answer option must be selected for multiple choice questions`);
        }

        const answerOptions = dto.answerOptions.map(answerOptionDto => {
            const optionId = answerOptionDto.optionId;
            const questionOption = questionOptions.find(option => option.id === optionId);
            if (!questionOption) {
                throw new NotFoundException(`Question option with id ${optionId} not found in question options`);
            }

            return this.answerOptionService.createAnswerOption(questionOption);
        });

        answer.answerOption = answerOptions;
        return answer;
    }
}
