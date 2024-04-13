import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatusEnum } from '../enum/task-status.enum';

@Entity('T_TASKS')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title' })
  title: string;

  @Column({ name: 'description' })
  description: string;

  @Column({
    name: 'status',
    type: 'enum',
    enum: TaskStatusEnum,
    default: TaskStatusEnum.OPEN,
  })
  status: TaskStatusEnum;
}
