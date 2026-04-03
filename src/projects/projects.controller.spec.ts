import { Test, TestingModule } from "@nestjs/testing"
import { ProjectsController } from "./projects.controller"
import { ProjectsService } from "./projects.service"
import { CreateProjectDTO } from "./dto/create-project.dto";
import { Project } from "./entities/project.entity";
import { PaginationDTO } from "src/common/dto/pagination.dto";
import { UpdateProjectDTO } from "./dto/update-project.dto";

describe("ProjectsController", () => {
    let controller: ProjectsController;
    let service: ProjectsService;

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

    const mockProjectService = {
        findAll: jest.fn(),
        findOne: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProjectsController],
            providers: [ProjectsService]
        }).overrideProvider(ProjectsService).useValue(mockProjectService).compile()

        controller = module.get<ProjectsController>(ProjectsController);
        service = module.get<ProjectsService>(ProjectsService)
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it("should list projects", async () => {
        const dto: PaginationDTO = {}
        const spy = jest.spyOn(service, 'findAll').mockImplementation(() => Promise.resolve({
            data: mockProjects,
            total: mockProjects.length,
            currentPage: 1,
            totalPages: 1
        }))
        const result = await controller.findAll(dto)

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith(dto)
        expect(result).toEqual({
            data: mockProjects,
            total: mockProjects.length,
            currentPage: 1,
            totalPages: 1
        })
    })

    it("should find project", async () => {
        const projectId: number = 1
        const spy = jest.spyOn(service, "findOne").mockImplementation(() => Promise.resolve(mockProjects[0]))
        const result = await controller.findOne(projectId)

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith(projectId)
        expect(result).toBe(mockProjects[0])
    })

    it('should create project', async () => {
        const dto: CreateProjectDTO = {
            title: "Title",
            description: "Description"
        }
        const spy = jest.spyOn(service, 'create').mockImplementation(() => Promise.resolve(mockProjects[0]))
        const result = await controller.create(dto)

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith(dto)
        expect(result).toBe(mockProjects[0])
    })

    it('should update project', async () => {
        const projectId: number = 1
        const dto: UpdateProjectDTO = {
            title: "Update title"
        }
        const spy = jest.spyOn(service, "update").mockImplementation(() => Promise.resolve(mockProjects[0]))
        const result = await controller.update(projectId, dto)

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith(projectId, dto)
        expect(result).toBe(mockProjects[0])
    })

    it('should delete project', async () => {
        const projectId: number = 1;
        const spy = jest.spyOn(service, "delete").mockImplementation(() => Promise.resolve({ raw: [], affected: 1 }))
        const result = await controller.delete(projectId)

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith(projectId)
        expect(result).toEqual({raw: [], affected: 1})
    })
})