import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { AppModule } from "../../src/app.module"
import { App } from "supertest/types"
import * as request from 'supertest';
import { DataSource } from "typeorm"
import { createManyProjects, createProject, findProyect } from "../utils/factories/project.factory"
import { runMigrations, cleanDB } from "../utils/database.utils";
import { CreateProjectDTO } from "../../src/projects/dto/create-project.dto";
import { UpdateProjectDTO } from "../../src/projects/dto/update-project.dto";
import { DatabaseModule } from "../../src/database/database.module";
import { DatabaseTestModule } from "../../src/database/database-test.module";

describe("Project e2e", () => {
    let app: INestApplication<App>
    let dataSource: DataSource

    beforeAll(() => {
        if (process.env.NODE_ENV !== 'test') {
            throw new Error('Tests e2e deben ejecutarse con NODE_ENV=test')
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

    it('(GET) /projects/:id', async () => {
        const project = await createProject(dataSource, { title: "Title", description: "Description" })
        const response = await request(app.getHttpServer()).get(`/projects/${project.id}`)

        expect(response.status).toEqual(200)
        expect(response.body).toEqual(expect.objectContaining({
            id: project.id,
            title: project.title,
            description: project.description,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        }))
    })

    it('(GET) /projects/:id throw NotFound exception when project not found', async () => {
        const response = await request(app.getHttpServer()).get(`/projects/1`)

        expect(response.status).toEqual(404)
        expect(response.body).toEqual(
            {
                message: 'Project with 1 not found',
                error: 'Not Found',
                statusCode: 404
            }
        )
    })

    it('(POST) /projects', async () => {
        const dto: CreateProjectDTO = {
            title: "New project",
            description: "Description"
        }
        const response = await request(app.getHttpServer()).post("/projects").send(dto)
        expect(response.status).toEqual(201)
        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(Number),
            title: dto.title,
            description: dto.description,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        }))
    })

    it('(POST) /projects throw BadRequest exception when dto is not valid', async () => {
        const response = await request(app.getHttpServer()).post("/projects").send({})
        expect(response.status).toEqual(400)
        expect(response.body).toEqual({
            message: expect.any(Array),
            error: "Bad Request",
            statusCode: 400
        })
        expect(response.body.message).toEqual(
            expect.arrayContaining([
                'Title can not be longer than 50 characters',
                'Title must be at least 3 characters long',
                'Title must be a string',
                'Title is required',
                'Description must be at least 3 characters long',
                'Description must be a string',
                'Description is required'

            ])
        )
    })

    it('(PUT) /projects/:id', async () => {
        const project = await createProject(dataSource, { title: "Title", description: "Description" })
        const dto: UpdateProjectDTO = {
            title: "Updated title"
        }
        const response = await request(app.getHttpServer()).put(`/projects/${project.id}`).send(dto)
        const updatedProject = await findProyect(dataSource, project.id)

        expect(response.status).toEqual(200)
        expect(response.body).toEqual(expect.objectContaining({
            id: expect.any(Number),
            title: updatedProject.title,
            description: project.description,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
        }))
    })

    it('(PUT) /projects/:id throw NotFound exception when project not found', async () => {
        const dto: UpdateProjectDTO = {
            title: "Updated title"
        }
        const response = await request(app.getHttpServer()).put(`/projects/1`).send(dto)

        expect(response.status).toEqual(404)
        expect(response.body).toEqual(
            {
                message: 'Project with 1 not found',
                error: 'Not Found',
                statusCode: 404
            }
        )
    })

    it('(PUT) /projects/:id throw BadRequest exception when dto is not valid', async () => {
        const project = await createProject(dataSource, { title: "Title", description: "Description" })
        const response = await request(app.getHttpServer()).put(`/projects/${project.id}`).send({})

        expect(response.status).toEqual(400)
        expect(response.body).toEqual(
            {
                message: `There aren't fields to update`,
                error: 'Bad Request',
                statusCode: 400
            }
        )
    })

    it('(DELETE) /projects/:id', async () => {
        const project = await createProject(dataSource, { title: "Title", description: "Description" })
        const response = await request(app.getHttpServer()).delete(`/projects/${project.id}`)

        expect(response.status).toEqual(200)
        expect(response.body).toEqual(expect.objectContaining({
            affected: 1,
            raw: []
        }))
    })

    it('(DELETE) /projects/:id throw NotFound exception when project not found', async () => {
        const response = await request(app.getHttpServer()).delete(`/projects/1`)

        expect(response.status).toEqual(404)
        expect(response.body).toEqual(
            {
                message: 'Project with 1 not found',
                error: 'Not Found',
                statusCode: 404
            }
        )
    })
})