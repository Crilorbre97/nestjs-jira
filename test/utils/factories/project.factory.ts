import { CreateProjectDTO } from "../../../src/projects/dto/create-project.dto";
import { Project } from "../../../src/projects/entities/project.entity";
import { DataSource, InsertResult } from "typeorm";

export class ProjectFactory {
    constructor(private dataSource: DataSource) {}
    
    async createProject(data: CreateProjectDTO): Promise<Project> {
        const repository = this.dataSource.getRepository(Project)
    
        return repository.save({
            ...data
        })
    }
    
    async createManyProjects(count: number): Promise<InsertResult> {
        const repository = this.dataSource.getRepository(Project)
    
        const projects = Array.from({ length: count }).map((_, i) => ({
            title: `Project ${i + 1}`,
            description: "Description"
        }));
    
        return repository.insert(projects);
    }
    
    async findProyect(id: number): Promise<Project> {
        const repository = this.dataSource.getRepository(Project)
        return repository.findOneByOrFail({ id: id })
    }

}