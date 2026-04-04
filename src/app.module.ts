import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import jwtConfig from "./config/jwt.config"
import databaseTestsConfig from './config/database-tests.config';
import { DatabaseModule } from './database/database.module';
import { ProjectModule } from './projects/project.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, databaseTestsConfig]
    }),
    DatabaseModule,
    ProjectModule,
    UsersModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
