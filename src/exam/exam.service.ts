import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/interfaces/paginated-response.interface';
import { CreateExamDTO } from './dto/create-exam.dto';
import { UpdateExamDTO } from './dto/update-exam.dto';

@Injectable()
export class ExamService {
    constructor(@InjectRepository(Exam) private examRepository: Repository<Exam>) { }

    async findAll(dto: PaginationDTO): Promise<PaginatedResponse<Exam>> {
        const { page = 1, limit = 10 } = dto;

        const [data, total] = await this.examRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit
        });

        return {
            data: data,
            total: total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        };
    }

    async findOne(id: number): Promise<Exam | null> {
        const exam = await this.examRepository.findOne({ where: { id } });

        if (!exam) throw new NotFoundException(`Exam with ${id} not found`)

        return exam;
    }

    async create(dto: CreateExamDTO): Promise<Exam> {
        const exam = this.examRepository.create(dto);
        return this.examRepository.save(exam);
    }

    async update(id: number, dto: UpdateExamDTO): Promise<Exam> {
        if(Object.keys(dto).length === 0) throw new NotFoundException('No data provided for update')

        const exam = await this.examRepository.findOne({ where: { id } });

        if (!exam) throw new NotFoundException(`Exam with ${id} not found`)

        Object.assign(exam, dto);
        return this.examRepository.save(exam);
    }

    async delete(id: number): Promise<void> {
        const exam = await this.examRepository.findOne({ where: { id } });

        if (!exam) throw new NotFoundException(`Exam with ${id} not found`)

        await this.examRepository.remove(exam);
    }
}
