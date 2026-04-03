import { Test, TestingModule } from "@nestjs/testing"
import { ProjectsService } from "./projects.service"
import { getRepositoryToken } from "@nestjs/typeorm"
import { Project } from "./entities/project.entity"
import { CreateProjectDTO } from "./dto/create-project.dto"
import { Repository } from "typeorm"
import { PaginationDTO } from "src/common/dto/pagination.dto"
import { NotFoundException } from "@nestjs/common"
import { UpdateProjectDTO } from "./dto/update-project.dto"

describe("ProjectService", () => {
    let service: ProjectsService;
    let repository: Repository<Project>

    const mockProjects: Project[] = [
        {
            "id": 1,
            "title": "Nuevo proyecto",
            "description": "Descripción del nuevo proyecto",
            "createdAt": new Date(),
            "updatedAt": new Date()
        },
        {
            "id": 2,
            "title": "Nuevo proyecto",
            "description": "Descripción del nuevo proyecto",
            "createdAt": new Date(),
            "updatedAt": new Date()
        }
    ]

    const mockProjectRepository = {
        findAndCount: jest.fn(),
        findOneBy: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        delete: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProjectsService, 
                {
                    provide: getRepositoryToken(Project),
                    useValue: mockProjectRepository
                }
            ]
        }).compile()

        service = module.get<ProjectsService>(ProjectsService)
        repository = module.get<Repository<Project>>(getRepositoryToken(Project))
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should find projects', async () => {
        const dto: PaginationDTO = {}
        const spy = jest.spyOn(repository, "findAndCount").mockImplementation(() => Promise.resolve([mockProjects, mockProjects.length]))
        const result = await service.findAll(dto)

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith({"skip": 0, "take": 10})
        expect(result).toEqual({
            data: mockProjects,
            total: mockProjects.length,
            currentPage: 1,
            totalPages: 1
        })
    })

    it('should find one project', async () => {
        const projectId = 1;
        const spy = jest.spyOn(repository, "findOneBy").mockImplementation(() => Promise.resolve(mockProjects[0]))
        const result = await service.findOne(projectId)

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith({ id: projectId })
        expect(result).toBe(mockProjects[0])
    })

    it("should throw exception when not found project on findOneBy", async () => {
        const projectId: number = 1;
        const spy = jest.spyOn(repository, "findOneBy").mockImplementation(() => Promise.resolve(null))

        await expect(service.findOne(projectId)).rejects.toThrow(NotFoundException);
        await expect(service.findOne(projectId)).rejects.toThrow(`Project with ${projectId} not found`);
        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith({ id: projectId })
    })

    it('should create project', async () => {
        const dto: CreateProjectDTO = {
            title: "Title",
            description: "Description"
        }

        const spyCreate = jest.spyOn(repository, 'create').mockImplementation(() => new Project())
        const spySave = jest.spyOn(repository, 'save').mockImplementation(() => Promise.resolve(mockProjects[0]))        
        const result = await service.create(dto)

        expect(spyCreate).toHaveBeenCalled()
        expect(spyCreate).toHaveBeenCalledWith(dto)
        expect(spySave).toHaveBeenCalled()
        expect(result).toBe(mockProjects[0])
    })

    it('should update project', async () => {
        const projectId: number = 1;
        const dto: UpdateProjectDTO = {
            title: "Updated title"
        }
        const spyFindOneBy = jest.spyOn(repository, "findOneBy").mockImplementation(() => Promise.resolve(mockProjects[0]))
        const spySave = jest.spyOn(repository, "save").mockImplementation(() => Promise.resolve(mockProjects[0]))
        const result = await service.update(projectId, dto)

        expect(spyFindOneBy).toHaveBeenCalled()
        expect(spyFindOneBy).toHaveBeenCalledWith({ id: projectId })
        expect(spySave).toHaveBeenCalled()
        expect(result).toBe(mockProjects[0])
    })

    it('should throw exception when not found project on update', async () => {
        const projectId: number = 1;
        const dto: UpdateProjectDTO = {
            title: "Updated title"
        }
        const spyFindOneBy = jest.spyOn(repository, "findOneBy").mockImplementation(() => Promise.resolve(null))
        const spySave = jest.spyOn(repository, "save")

        await expect(service.update(projectId, dto)).rejects.toThrow(NotFoundException);
        await expect(service.update(projectId, dto)).rejects.toThrow(`Project with ${projectId} not found`);
        expect(spyFindOneBy).toHaveBeenCalled()
        expect(spyFindOneBy).toHaveBeenCalledWith({ id: projectId })
        expect(spySave).toHaveBeenCalledTimes(0)
    })

    it('should delete project', async () => {
        const projectId: number = 1;
        const spyFindOneBy = jest.spyOn(repository, "findOneBy").mockImplementation(() => Promise.resolve(mockProjects[0]))
        const spyDelete = jest.spyOn(repository, "delete").mockImplementation(() => Promise.resolve({ raw: [], affected: 1 }))
        const result = await service.delete(projectId)

        expect(spyFindOneBy).toHaveBeenCalled()
        expect(spyFindOneBy).toHaveBeenCalledWith({ id: projectId })
        expect(spyDelete).toHaveBeenCalled()
        expect(spyDelete).toHaveBeenCalledWith(mockProjects[0].id)
        expect(result).toEqual({raw: [], affected: 1})
    })

    it('should throw exception when not found project on delete', async () => {
        const projectId: number = 1;
        const spyFindOneBy = jest.spyOn(repository, "findOneBy").mockImplementation(() => Promise.resolve(null))
        const spyDelete = jest.spyOn(repository, "delete")

        await expect(service.delete(projectId)).rejects.toThrow(NotFoundException);
        await expect(service.delete(projectId)).rejects.toThrow(`Project with ${projectId} not found`);
        expect(spyFindOneBy).toHaveBeenCalled()
        expect(spyFindOneBy).toHaveBeenCalledWith({ id: projectId })
        expect(spyDelete).toHaveBeenCalledTimes(0)
    })
})