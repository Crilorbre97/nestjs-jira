import { CreateProjectDTO } from "../../../src/projects/dto/create-project.dto";
import { Project } from "../../../src/projects/entities/project.entity";
import { DataSource, InsertResult } from "typeorm";

export const createProject = async (dataSource: DataSource, data: CreateProjectDTO): Promise<Project> => {
    const repository = dataSource.getRepository(Project)

    return repository.save({
        ...data
    })
}

export const createManyProjects = async (dataSource: DataSource, count: number): Promise<InsertResult> => {
    const repository = dataSource.getRepository(Project)

    const projects = Array.from({ length: count }).map((_, i) => ({
        title: `Project ${i + 1}`,
        description: "Description"
    }));

    return repository.insert(projects);
}

export const findProyect = async (dataSource: DataSource, id: number): Promise<Project> => {
    const repository = dataSource.getRepository(Project)
    return repository.findOneByOrFail({ id: id })
}