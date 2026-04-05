import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get('database-tests.host'),
                port: config.get('database-tests.port'),
                username: config.get('database-tests.username'),
                password: config.get('database-tests.password'),
                database: config.get('database-tests.name'),
                entities: [__dirname + '/../**/*.entity.{js,ts}'],
                migrations: [__dirname + '/../migrations/*.{js,ts}'],
                logging: false
            }),
        })
    ]
})
export class DatabaseTestModule { }
