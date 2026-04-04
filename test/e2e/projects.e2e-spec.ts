import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { AppModule } from "../../src/app.module"
import { App } from "supertest/types"
import * as request from 'supertest';
import { DataSource } from "typeorm"
import { createManyProjects } from "../utils/factories/project.factory"
import { runMigrations, cleanDB } from "../utils/database.utils";

describe("Project e2e", () => {
    let app: INestApplication<App>
    let dataSource: DataSource

    beforeAll(async () => {
       const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule]
       }).compile()

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

    it('(GET) /projects', async () => {
        createManyProjects(dataSource, 15)
        const response = await request(app.getHttpServer()).get("/projects")

        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(10);
        expect(response.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    title: expect.any(String),
                    description: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                })
            ])
        )
        expect(response.body).toEqual({
            data: expect.any(Array),
            total: 15,
            currentPage: 1,
            totalPages: 2
        })
    })

    it('(GET) /projects page 2', async () => {
        createManyProjects(dataSource, 15)
        const response = await request(app.getHttpServer()).get("/projects?page=2")

        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(5);
        expect(response.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    title: expect.any(String),
                    description: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                })
            ])
        )
        expect(response.body).toEqual({
            data: expect.any(Array),
            total: 15,
            currentPage: 2,
            totalPages: 2
        })
    })

    it('(GET) /projects limit 5', async () => {
        createManyProjects(dataSource, 15)
        const response = await request(app.getHttpServer()).get("/projects?limit=5")

        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(5);
        expect(response.body.data).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    title: expect.any(String),
                    description: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String),
                })
            ])
        )
        expect(response.body).toEqual({
            data: expect.any(Array),
            total: 15,
            currentPage: 1,
            totalPages: 3
        })
    })
})