import { registerAs } from "@nestjs/config";

export default registerAs('queueus', () => ({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '5432'),
    password: process.env.REDIS_PASSWORD
}))