import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';

@Controller('answer')
export class AnswerController {
    constructor(private readonly answerService: AnswerService) {}

    @Post("/exam-session/:examSessionId/question/:questionId")
    async createAnswer(@Param('examSessionId', ParseIntPipe) examSessionId: number, @Param('questionId', ParseIntPipe) questionId: number, @Body() dto: CreateAnswerDto) {
        return this.answerService.createAnswer(examSessionId, questionId, dto);
    }
}
