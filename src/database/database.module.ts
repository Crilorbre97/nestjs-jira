import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get('database.host'),
                port: config.get('database.port'),
                username: config.get('database.username'),
                password: config.get('database.password'),
                database: config.get('database.name'),
                entities: [__dirname + '/../**/*.entity.{js,ts}'],
                migrations: [__dirname + '/../migrations/*.{js,ts}'],
                logging: true
            }),
        })
    ]
})
export class DatabaseModule { }
