import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswerOption } from './entities/answer-option.entity';
import { Repository } from 'typeorm';
import { QuestionOption } from 'src/question-option/entities/question-option.entity';

@Injectable()
export class AnswerOptionService {
    constructor(@InjectRepository(AnswerOption) private answerOptionRepository: Repository<AnswerOption>) { }

    createAnswerOption(questionOption: QuestionOption): AnswerOption {
        return this.answerOptionRepository.create({ questionOption });
    }
}
