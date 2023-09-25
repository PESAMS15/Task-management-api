import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { createTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
   private tasks: Task[] = [];

   getAllTasks(): Task[]{
       return this.tasks;
   }
   getTaskById(id: string): Task {
    return this.tasks.find(task => task.id === id)
   }

   createTask(createTaskDto: createTaskDto): Task{
    const {title, description} = createTaskDto
       const task: Task = {
           id: uuid(),
           title,
           description,
           status: TaskStatus.OPEN,
       };
       this.tasks.push(task);
       return task;
   }
   getTaskswithFilters(filterDto: GetTaskFilterDto): Task[]{
         return this.tasks;
   }

   updateStatus(id: string, status: TaskStatus ): Task{
       const task = this.getTaskById(id)
       console.log("task", task)
    //    task.status = status;
       return task;
   }

   deleteTask(id: string): void{
       this.tasks =  this.tasks.filter(task => task.id !== id)
   }

}
