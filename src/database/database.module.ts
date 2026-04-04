import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get(process.env.NODE_ENV === 'test' ? 'database-tests.host' : 'database.host'),
                port: config.get(process.env.NODE_ENV === 'test' ? 'database-tests.port' : 'database.port'),
                username: config.get(process.env.NODE_ENV === 'test' ? 'database-tests.username' : 'database.username'),
                password: config.get(process.env.NODE_ENV === 'test' ? 'database-tests.password' : 'database.password'),
                database: config.get(process.env.NODE_ENV === 'test' ? 'database-tests.name' : 'database.name'),
                entities: [__dirname + '/../**/*.entity.{js,ts}'],
                migrations: [__dirname + '/../migrations/*.{js,ts}'],
                logging: process.env.NODE_ENV === 'test' ? false : true
            }),
        })
    ]
})
export class DatabaseModule { }
