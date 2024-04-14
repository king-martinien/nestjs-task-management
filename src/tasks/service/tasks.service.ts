import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from '../repository/tasks.repository';
import { from, map, Observable, switchMap } from 'rxjs';
import { TaskEntity } from '../entity/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskStatusDto } from '../dto/update-task-status.dto';
import { FilterTaskDto } from '../dto/filter-task.dto';
import { UserEntity } from '../../auth/entity/user.entity';

@Injectable()
export class TasksService {
  constructor(private readonly _tasksRepository: TasksRepository) {}

  getTasks(
    filterTaskDto: FilterTaskDto,
    user: UserEntity,
  ): Observable<TaskEntity[]> {
    return from(this._tasksRepository.filterTasks(filterTaskDto, user));
  }

  getTaskById(id: string, user: UserEntity): Observable<TaskEntity> {
    const foundTask$ = from(this._tasksRepository.findOneBy({ id, user }));
    return foundTask$.pipe(
      map((foundTask: TaskEntity | null) => {
        if (!foundTask) {
          throw new NotFoundException(`Task not found with id ${id}`);
        }
        return foundTask;
      }),
    );
  }

  createTask(
    createTaskDto: CreateTaskDto,
    user: UserEntity,
  ): Observable<TaskEntity> {
    const { title, description } = createTaskDto;
    const newTask: TaskEntity = this._tasksRepository.create({
      title,
      description,
      user,
    });
    return from(this._tasksRepository.save(newTask));
  }

  updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: UserEntity,
  ): Observable<TaskEntity> {
    const { status } = updateTaskStatusDto;
    const foundTask$: Observable<TaskEntity> = this.getTaskById(id, user);
    return foundTask$.pipe(
      switchMap((foundTask: TaskEntity) => {
        foundTask.status = status;
        return this._tasksRepository.save(foundTask);
      }),
    );
  }

  deleteTaskById(id: string, user: UserEntity): Observable<void> {
    const foundTask$: Observable<TaskEntity> = this.getTaskById(id, user);
    return foundTask$.pipe(
      map((foundTask: TaskEntity) => {
        from(this._tasksRepository.remove(foundTask));
      }),
    );
  }
}
