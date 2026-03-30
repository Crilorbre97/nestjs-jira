import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserAccount } from './entities/user-account.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, UserAccount])],
    providers: [UsersService],
    controllers: [UsersController]
})
export class UsersModule { }
