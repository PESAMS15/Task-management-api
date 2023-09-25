import { Body, Controller, Get, Post, Param, Delete, Patch, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './tasks.model';
import { createTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService){}

    @Get()
    getTasks(@Query() filterDto: GetTaskFilterDto) : Task[]{
        console.log("filterDto", filterDto)
        return this.tasksService.getAllTasks();

    }

    @Get("/:id")
    getTaskById(@Param("id") id: string){
        return this.tasksService.getTaskById(id);

    }


    @Post()
    createTask( @Body() createTaskDto: createTaskDto): Task{
       return this.tasksService.createTask(createTaskDto)
    }

    @Delete("/:id")
    deleteTaks(@Param("id") id: string): void{
        this.tasksService.deleteTask(id)

    }

    @Patch("/:id/status")
    updateTasks(@Param("/:id")id: string, @Body("status")status: TaskStatus): Task {
        return this.tasksService.updateStatus(id, status)
    }
    
}
