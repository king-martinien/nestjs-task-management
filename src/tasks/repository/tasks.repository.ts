import { Repository } from 'typeorm';
import { TaskEntity } from '../entity/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterTaskDto } from '../dto/filter-task.dto';
import { UserEntity } from '../../auth/entity/user.entity';

export class TasksRepository extends Repository<TaskEntity> {
  constructor(
    @InjectRepository(TaskEntity)
    _tasksRepository: Repository<TaskEntity>,
  ) {
    super(
      _tasksRepository.target,
      _tasksRepository.manager,
      _tasksRepository.queryRunner,
    );
  }

  async filterTasks(
    filterTaskDto: FilterTaskDto,
    user: UserEntity,
  ): Promise<TaskEntity[]> {
    const { search, status } = filterTaskDto;
    const tasksQuery = this.createQueryBuilder('Task').where({ user });

    if (search) {
      tasksQuery.andWhere(
        `(Task.title ILIKE :search OR Task.description ILIKE :search)`,
        {
          search: `%${search}%`,
        },
      );
    }

    if (status) {
      tasksQuery.andWhere('Task.status = :status', {
        status,
      });
    }

    return await tasksQuery.getMany();
  }
}
