import { DataSource } from 'typeorm';
import * as dotenv from "dotenv"
import * as path from 'path';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [path.join(__dirname, 'src/**/*.entity.ts')],
    migrations: [path.join(__dirname, 'migrations/*.ts')]
});