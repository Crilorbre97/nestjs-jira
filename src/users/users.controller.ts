import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExamService } from 'src/exam/exam.service';

@Controller('users')
export class UsersController {

    constructor(private readonly examService: ExamService) { }

    @UseGuards(JwtAuthGuard)
    @Get("profile")
    async profile(@CurrentUser() user) {
        return user
    }

    @UseGuards(JwtAuthGuard)
    @Get("completed-exams")
    async completedExams(@CurrentUser() user) {
        return this.examService.findCompletedExamsByUserId(user.id);
    }

}
