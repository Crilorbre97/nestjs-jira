import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDTO } from './dto/create-project.dto';
import { UpdateProjectDTO } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectService: ProjectsService){}

    @Get()
    findAll(){
        return this.projectService.findAll()
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
