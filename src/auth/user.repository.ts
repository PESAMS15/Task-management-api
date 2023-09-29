import { User } from "./user.entity";
import { EntityRepository, Repository } from "typeorm"; 
// import { CreateTaskDto } from "./dto/create-task.dto";   

@EntityRepository(User)
export class UserRepository extends Repository <User>{

}