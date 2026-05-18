import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExamService } from 'src/exam/exam.service';
import { ExamSessionService } from 'src/exam-session/exam-session.service';

@Controller('users')
export class UsersController {

    constructor(private readonly examService: ExamService, private readonly examSessionService: ExamSessionService) { }

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

    @UseGuards(JwtAuthGuard)
    @Get("/exam-session/:id/score")
    async score(@CurrentUser() user, @Param("id", ParseIntPipe) examSessionId: number) {
        return await this.examSessionService.calculateUserScore(user.id, examSessionId);
    }

}
