import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatusEnum } from '../enum/task-status.enum';
import { UserEntity } from '../../auth/entity/user.entity';
import { Exclude } from 'class-transformer';

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

  @ManyToOne(() => UserEntity, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: UserEntity;
}
