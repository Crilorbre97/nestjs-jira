import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get('database.host'),
                port: config.get('database.port'),
                username: config.get('database.username'),
                password: config.get('database.password'),
                database: config.get('database.name'),
                entities: [],
                synchronize: true,
                logging: true
            }),
        })
    ]
})
export class DatabaseModule { }
