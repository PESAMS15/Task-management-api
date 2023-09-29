import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
// import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { createTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './tasks.repository';
import { Task } from './task.entity';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService');
  constructor(
    @InjectRepository(Task)
    private taskRepository: MongoRepository<Task>,
  ) {}
  //    private tasks: Task[] = [];

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.taskRepository.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.username
        }", Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
    // return await this.taskRepository.find();
  }

  //    getAllTasks(): Task[]{
  //        return this.tasks;
  //    }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, user: { id: user.id } },
    });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }
  //    getTaskById(id: string): Task {
  //     const found =  this.tasks.find(task => task.id === id)
  //     if(!found){
  //         throw new NotFoundException(`Task with ID "${id}" not found`)
  //     }
  //     return found;
  //    }

  async createTask(createTaskDto: createTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user: user,
    });
    try {
      await this.taskRepository.save(task);
    } catch (error) {
      this.logger.error(
        `Failed to create task for user "${
          user.username
        }", Filters: ${JSON.stringify(createTaskDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
    delete task.user;
    return task;
  }

  //    createTask(createTaskDto: createTaskDto): Task{
  //     const {title, description} = createTaskDto
  //        const task: Task = {
  //            id: uuid(),
  //            title,
  //            description,
  //            status: TaskStatus.OPEN,
  //        };
  //        this.tasks.push(task);
  //        return task;
  //    }
  //    getTaskswithFilters(filterDto: GetTaskFilterDto): Task[]{
  //     const {status, search} = filterDto;
  //     let tasks = this.getAllTasks();
  //     if(status){
  //         tasks = tasks.filter(task => task.status === status)
  //     }
  //     if(search){
  //         tasks = tasks.filter(task =>
  //             task.title.includes(search) ||
  //             task.description.includes(search)
  //         )
  //     }
  //     return tasks;
  //    }

  //    updateStatus(id: string, status: TaskStatus ): Task{
  //     const task = this.getTaskById(id)
  //     task.status = status;
  //     return task;
  //    }
  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }

  //    deleteTask(id: string): void{
  //     const found =  this.getTaskById(id)
  //        this.tasks =  this.tasks.filter(task => task.id !== id)
  //    }
  async deleteTask(id: number, user: User): Promise<void> {
    const found = await this.taskRepository.delete({
      id,
      user: { id: user.id },
    });
    if (found.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    // return found;
  }
}
