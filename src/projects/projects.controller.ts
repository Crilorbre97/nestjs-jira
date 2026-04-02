import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDTO } from './dto/create-project.dto';
import { UpdateProjectDTO } from './dto/update-project.dto';
import { PaginationDTO } from '../common/dto/pagination.dto';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectService: ProjectsService){}

    @Get()
    findAll(@Query() dto: PaginationDTO){
        return this.projectService.findAll(dto)
    }

    @Get(":id")
    findOne(@Param("id", ParseIntPipe) id: number){
        return this.projectService.findOne(id);
    }

    @Post()
    create(@Body() dto: CreateProjectDTO){
        return this.projectService.create(dto)
    }

    @Put(":id")
    update(@Param("id", ParseIntPipe) id: number, @Body() dto: UpdateProjectDTO){
        return this.projectService.update(id, dto)
    }

    @Delete(":id")
    delete(@Param("id", ParseIntPipe) id: number){
        return this.projectService.delete(id)
    }
}
