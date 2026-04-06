import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import jwtConfig from "./config/jwt.config"
import databaseTestsConfig from './config/database-tests.config';
import bullConfig from './config/bull.config';
import { DatabaseModule } from './database/database.module';
import { ProjectModule } from './projects/project.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QueueModule } from './queue/queue.module';
import clientsConfig from './config/clients.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, databaseTestsConfig, bullConfig, clientsConfig]
    }),
    DatabaseModule,
    ProjectModule,
    UsersModule,
    AuthModule,
    QueueModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
