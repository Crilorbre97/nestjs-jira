import { Test, TestingModule } from "@nestjs/testing"
import { AppModule } from "../../src/app.module"
import { DatabaseModule } from "../../src/database/database.module"
import { DatabaseTestModule } from "../../src/database/database-test.module"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { App } from "supertest/types"
import { DataSource } from "typeorm"
import { cleanDB, runMigrations } from "../utils/database.utils"
import { CreateUserDTO } from "../../src/auth/dto/create-user.dto"
import { UserGender } from "../../src/users/entities/user.entity"
import * as request from 'supertest';
import { createUser } from "../utils/factories/user.factory"
import { LoginUserDTO } from "../../src/auth/dto/login-user.dto"
import { loginUser } from "../utils/auth.utils"

describe("Auth e2e", () => {
    let app: INestApplication<App>
    let dataSource: DataSource

    beforeAll(() => {
        if (process.env.NODE_ENV !== 'test'){
            throw new Error("Tests e2e deben ejecutarse con NODE_ENV=test")
        }
    })

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule]
        })
        .overrideModule(DatabaseModule).useModule(DatabaseTestModule)
        .compile()

        app = moduleFixture.createNestApplication()
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true, // remove properties that don't have decorators
                forbidNonWhitelisted: true,
                transform: true,
                disableErrorMessages: false
            })
        )
        await app.init()

        dataSource = app.get(DataSource)
        await runMigrations(dataSource)
    })

    beforeEach(async () => {
        await cleanDB(dataSource)
    })

    afterAll(async () => {
        await app.close()
    })

    it('(POST) /auth/register', async () => {
        const dto: CreateUserDTO = {
            name: "name",
            lastname: "lastname",
            email: "email@gmail.com",
            phone: "666666666",
            gender: UserGender.MALE,
            username: "username",
            password: "Cristi@na1",
            confirmPassword: "Cristi@na1"
        }
        const response = await request(app.getHttpServer()).post('/auth/register').send(dto)
        expect(response.status).toEqual(201)
        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(Number),
            name: dto.name,
            lastname: dto.lastname,
            email: dto.email,
            phone: dto.phone,
            gender: dto.gender,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            userAccount: expect.objectContaining({
                id: expect.any(Number),
                username: dto.username,
                role: "user",
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
            })
        }))
    })

    it('(POST) /auth/register throw ConflictException exception when email is already used', async () => {
        const dto: CreateUserDTO = {
            name: "name",
            lastname: "lastname",
            email: "email@gmail.com",
            phone: "666666666",
            gender: UserGender.MALE,
            username: "username",
            password: "Cristi@na1",
            confirmPassword: "Cristi@na1"
        }
        await createUser(dataSource, dto)
        const response = await request(app.getHttpServer()).post('/auth/register').send(dto)
        expect(response.status).toEqual(409)
        expect(response.body).toEqual({
            message: "Email already in use. Please, try with a different email",
            error: "Conflict",
            statusCode: 409
        })
    })

    it('(POST) /auth/register throw ConflictException exception when username is already used', async () => {
        const dto: CreateUserDTO = {
            name: "name",
            lastname: "lastname",
            email: "email@gmail.com",
            phone: "666666666",
            gender: UserGender.MALE,
            username: "username",
            password: "Cristi@na1",
            confirmPassword: "Cristi@na1"
        }
        await createUser(dataSource, dto)

        const newDto: CreateUserDTO = {
            ...dto,
            email: "new_email@gmail.com"
        }
        const response = await request(app.getHttpServer()).post('/auth/register').send(newDto)
        expect(response.status).toEqual(409)
        expect(response.body).toEqual({
            message: "Username alredy in use. Please, try with different username",
            error: "Conflict",
            statusCode: 409
        })
    })

    it('(POST) /auth/register throw BadRequest exception when dto is not valid', async () => {
        const dto: CreateUserDTO = {
            name: "name",
            lastname: "lastname",
            email: "email@gmail.com",
            phone: "666666666",
            gender: UserGender.MALE,
            username: "username",
            password: "Cristi@na1",
            confirmPassword: "incorrect_password"
        }
        const response = await request(app.getHttpServer()).post('/auth/register').send(dto)
        expect(response.status).toEqual(400)
        expect(response.body).toEqual({
            message: expect.any(Array),
            error: "Bad Request",
            statusCode: 400
        })
        expect(response.body.message).toEqual(expect.arrayContaining([
            'Passwords do not match'
        ]))
    })

    it('(POST) /auth/login', async () => {
        const dto: CreateUserDTO = {
            name: "name",
            lastname: "lastname",
            email: "email@gmail.com",
            phone: "666666666",
            gender: UserGender.MALE,
            username: "username",
            password: "Cristi@na1",
            confirmPassword: "Cristi@na1"
        }
        await createUser(dataSource, dto)

        const loginDto: LoginUserDTO = {
            username: dto.username,
            password: dto.password
        }
        const response = await request(app.getHttpServer()).post('/auth/login').send(loginDto)
        expect(response.status).toEqual(200)
        expect(response.body).toEqual(expect.objectContaining({
            accessToken: expect.any(String)
        }))
    })

    it('(POST) /auth/login throw UnauthorizedException exception when user account is not found', async () => {
        const dto: CreateUserDTO = {
            name: "name",
            lastname: "lastname",
            email: "email@gmail.com",
            phone: "666666666",
            gender: UserGender.MALE,
            username: "username",
            password: "Cristi@na1",
            confirmPassword: "Cristi@na1"
        }
        await createUser(dataSource, dto)

        const loginDto: LoginUserDTO = {
            username: "username_updated",
            password: dto.password
        }
        const response = await request(app.getHttpServer()).post('/auth/login').send(loginDto)
        expect(response.status).toEqual(401)
        expect(response.body).toEqual({
            message: "Invalid credentials or account not exists",
            error: "Unauthorized",
            statusCode: 401
        })
    })

    it('(POST) /auth/login throw UnauthorizedException exception when passwords do not match', async () => {
        const dto: CreateUserDTO = {
            name: "name",
            lastname: "lastname",
            email: "email@gmail.com",
            phone: "666666666",
            gender: UserGender.MALE,
            username: "username",
            password: "Cristi@na1",
            confirmPassword: "Cristi@na1"
        }
        await createUser(dataSource, dto)

        const loginDto: LoginUserDTO = {
            username: dto.username,
            password: "password"
        }
        const response = await request(app.getHttpServer()).post('/auth/login').send(loginDto)
        expect(response.status).toEqual(401)
        expect(response.body).toEqual({
            message: "Invalid credentials or account not exists",
            error: "Unauthorized",
            statusCode: 401
        })
    })

    it('(POST) /auth/login throw BadRequest exception when dto is not valid', async () => {
        const dto: CreateUserDTO = {
            name: "name",
            lastname: "lastname",
            email: "email@gmail.com",
            phone: "666666666",
            gender: UserGender.MALE,
            username: "username",
            password: "Cristi@na1",
            confirmPassword: "Cristi@na1"
        }
        await createUser(dataSource, dto)

        const loginDto: LoginUserDTO = {
            username: dto.username,
            password: ""
        }
        const response = await request(app.getHttpServer()).post('/auth/login').send(loginDto)
        expect(response.status).toEqual(400)
        expect(response.body).toEqual({
            message: expect.any(Array),
            error: "Bad Request",
            statusCode: 400
        })
        expect(response.body.message).toEqual(
            expect.arrayContaining([
                'Password is required'
            ])
        )
    })

    it('(GET) /auth/profile', async () => {
        const token = await loginUser(dataSource, app)

        const response = await request(app.getHttpServer()).get('/auth/profile').set('Authorization', `Bearer ${token}`)
        expect(response.status).toEqual(200)
        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(Number),
            name: expect.any(String),
            lastname: expect.any(String),
            email: expect.any(String),
            phone: expect.any(String),
            gender: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String)
        }))
    })

    it('(GET) /auth/profile throw Unauthorized exception when token is not valid', async () => {
        const response = await request(app.getHttpServer()).get('/auth/profile').set('Authorization', `Bearer invalid_token`)
        expect(response.status).toEqual(401)
        expect(response.body).toEqual(
            {
                message: 'Unauthorized',
                statusCode: 401
            }
        )
    })
})