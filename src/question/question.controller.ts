import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { QuestionService } from './question.service';
import { ExamService } from 'src/exam/exam.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Controller('questions')
export class QuestionController {
    constructor(private readonly questionService: QuestionService, private readonly examService: ExamService){}

    @Get('exam/:id')
    getQuestionsByExam(@Param('id', ParseIntPipe) id: number){
        return this.questionService.findQuestionsByExam(id);
    }

    @Post("exam/:id")
    createQuestion(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateQuestionDto){
        return this.questionService.createQuestion(id, dto);
    }
}
