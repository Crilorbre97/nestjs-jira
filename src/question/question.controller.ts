import { BadRequestException, Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
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

    @Get(':id')
    getQuestionById(@Param('id', ParseIntPipe) id: number){
        return this.questionService.findOne(id);
    }

    @Post("exam/:id")
    async createQuestion(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateQuestionDto){
        const errors = await CreateQuestionDto.validate(dto);
        if (errors.length > 0) {
            throw new BadRequestException(errors);
        }

        return this.questionService.createQuestion(id, dto);
    }

    @Delete(':id')
    async deleteQuestion(@Param('id', ParseIntPipe) id: number){
        return this.questionService.deleteQuestion(id);
    }
}
