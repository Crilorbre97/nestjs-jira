import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { DatabaseModule } from './database/database.module';
import { ProjectModule } from './projects/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig]
    }),
    DatabaseModule,
    ProjectModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
