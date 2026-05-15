import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionOption } from './entities/question-option.entity';
import { Repository } from 'typeorm';
import { CreateQuestionOptionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionOptionService {
    constructor(@InjectRepository(QuestionOption) private questionOptionRepository: Repository<QuestionOption>){}

    newQuestionOption(dto: CreateQuestionOptionDto): QuestionOption {
        return this.questionOptionRepository.create(dto);
    }
}
