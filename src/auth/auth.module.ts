import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserAccount } from '../users/entities/user-account.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BullModule } from '@nestjs/bullmq';
import { AuthProducer } from './producer/auth.producer';
import { AuthProcessor } from './processor/auth.processor';
import { ClientModule } from '../clients/client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserAccount]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwt.secret')
      })
    }),
    PassportModule,
    BullModule.registerQueue({ name: 'auth' }),
    ClientModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthProducer, AuthProcessor]
})
export class AuthModule { }
