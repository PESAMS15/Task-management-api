import { Task } from "./task.entity";
import { EntityRepository, Repository } from "typeorm"; 
// import { CreateTaskDto } from "./dto/create-task.dto";   

@EntityRepository(Task)
export class TaskRepository extends Repository <Task>{

}