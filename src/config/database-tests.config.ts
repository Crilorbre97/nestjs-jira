import { registerAs } from '@nestjs/config'

export default registerAs('database-tests', () => ({
    host: process.env.POSTGRES_HOST_TESTS,
    port: parseInt(process.env.POSTGRES_PORT_TESTS || '5432'),
    username: process.env.POSTGRES_USER_TESTS,
    password: process.env.POSTGRES_PASSWORD_TESTS,
    name: process.env.POSTGRES_DB_TESTS,
}))