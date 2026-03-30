import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserAccount } from 'src/users/entities/user-account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserAccount])],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule { }
