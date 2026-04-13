import { Test, TestingModule } from "@nestjs/testing"
import { AppModule } from "../../src/app.module"
import { DatabaseModule } from "../../src/database/database.module"
import { DatabaseTestModule } from "../../src/database/database-test.module"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import { App } from "supertest/types"
import { DataSource } from "typeorm"
import { cleanDB } from "../utils/database.utils"
import * as request from 'supertest';
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
    })

    beforeEach(async () => {
        await cleanDB(dataSource)
    })

    afterAll(async () => {
        await app.close()
    })

    it('(GET) /users/profile', async () => {
        const token = await loginUser(dataSource, app)
        
        const response = await request(app.getHttpServer()).get('/users/profile').set('Authorization', `Bearer ${token}`)
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

    it('(GET) /users/profile throw Unauthorized exception when token is not valid', async () => {
        const response = await request(app.getHttpServer()).get('/users/profile').set('Authorization', `Bearer invalid_token`)
        expect(response.status).toEqual(401)
        expect(response.body).toEqual(
            {
                message: 'Unauthorized',
                statusCode: 401
            }
        )
    })
})