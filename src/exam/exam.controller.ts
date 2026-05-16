import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ExamService } from './exam.service';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { CreateExamDTO } from './dto/create-exam.dto';
import { UpdateExamDTO } from './dto/update-exam.dto';

@Controller('exams')
export class ExamController {
    constructor(private readonly examService: ExamService){}

    @Get()
    findAll(@Query() dto: PaginationDTO){
        return this.examService.findAll(dto)
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number){
        return this.examService.findOne(id)
    }

    @Post()
    create(@Body() dto: CreateExamDTO){
        return this.examService.create(dto)
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateExamDTO){
        return this.examService.update(id, dto)
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number){
        return this.examService.delete(id)
    }
}
