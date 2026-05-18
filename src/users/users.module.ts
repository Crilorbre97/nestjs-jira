import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAccount } from './entities/user-account.entity';
import { ExamModule } from 'src/exam/exam.module';
import { ExamSessionModule } from 'src/exam-session/exam-session.module';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserAccount]), ExamModule, ExamSessionModule],
    providers: [UsersService],
    controllers: [UsersController]
})
export class UsersModule { }
