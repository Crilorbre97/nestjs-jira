import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateProjectDTO } from './dto/create-project.dto';
import { UpdateProjectDTO } from './dto/update-project.dto';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>
    ){}

    async findAll(dto: PaginationDTO): Promise<PaginatedResponse<Project>> {
        const { page = 1, limit = 10 } = dto;

        const [data, total] = await this.projectRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit
        })

        return {
            data: data,
            total: total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        }
    }

    async findOne(id: number): Promise<Project | null> {
        const project = await this.projectRepository.findOneBy({ id })

        if (!project) throw new NotFoundException(`Project with ${id} not found`)

        return project
    }

    create(dto: CreateProjectDTO): Promise<Project> {
        const project = this.projectRepository.create(dto)
        return this.projectRepository.save(project)
    }

    async update(id: number, dto: UpdateProjectDTO): Promise<Project> {
        const project = await this.projectRepository.findOneBy({ id })

        if (!project) throw new NotFoundException(`Project with ${id} not found`);

        Object.assign(project, Object.fromEntries(
            Object.entries(dto).filter(([_, v]) => v !== undefined)
        ));
        return this.projectRepository.save(project);
    }

    async delete(id: number): Promise<DeleteResult> {
        const project = await this.projectRepository.findOneBy({ id })

        if (!project) throw new NotFoundException(`Project with ${id} not found`);

        return this.projectRepository.delete(id)
    }
}
