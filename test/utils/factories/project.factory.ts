import { CreateProjectDTO } from "../../../src/projects/dto/create-project.dto";
import { Project } from "../../../src/projects/entities/project.entity";
import { DataSource } from "typeorm";

export const createProject = async (dataSource: DataSource, data: CreateProjectDTO) => {
    const repository = dataSource.getRepository(Project)

    return repository.save({
        ...data
    })
}

export const createManyProjects = async (dataSource: DataSource, count: number) => {
    const repository = dataSource.getRepository(Project)

    const projects = Array.from({ length: count }).map((_, i) => ({
        title: `Project ${i + 1}`,
        description: "Description"
    }));

    return repository.insert(projects);
}