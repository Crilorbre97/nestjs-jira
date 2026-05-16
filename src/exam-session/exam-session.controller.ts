import { Controller, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ExamSessionService } from './exam-session.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('exam-session')
export class ExamSessionController {
    constructor(private examSessionService: ExamSessionService) {}

    @UseGuards(JwtAuthGuard)
    @Post("exam/:id")
    async createExamSession(@Param("id", ParseIntPipe) examId: number, @CurrentUser() user: User) {
        return this.examSessionService.createExamSession(examId, user);
    }
}
