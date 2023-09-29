import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'; // This is a library
import { TaskStatus } from './task-status.enum';
import { User } from 'src/auth/user.entity';

@Entity() // This is a decorator
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn() // This is a decorator
  id: number; // This is a property

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  //   @Column()
  //   userId: number;

  @ManyToOne((type) => Task, (task) => task.id, { eager: false })
  user: User;
}
