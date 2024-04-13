import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from '../repository/tasks.repository';
import { from, map, Observable, switchMap } from 'rxjs';
import { TaskEntity } from '../entity/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskStatusDto } from '../dto/update-task-status.dto';
import { FilterTaskDto } from '../dto/filter-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly _tasksRepository: TasksRepository) {}

  getAllTasks(): Observable<TaskEntity[]> {
    return from(this._tasksRepository.find());
  }

  getTasksWithFilters(filterTaskDto: FilterTaskDto): Observable<TaskEntity[]> {
    return from(this._tasksRepository.filterTasks(filterTaskDto));
  }

  getTaskById(id: string): Observable<TaskEntity> {
    const foundTask$ = from(this._tasksRepository.findOneBy({ id }));
    return foundTask$.pipe(
      map((foundTask: TaskEntity | null) => {
        if (!foundTask) {
          throw new NotFoundException(`Task not found with id ${id}`);
        }
        return foundTask;
      }),
    );
  }

  createTask(createTaskDto: CreateTaskDto): Observable<TaskEntity> {
    const { title, description } = createTaskDto;
    const newTask: TaskEntity = this._tasksRepository.create({
      title,
      description,
    });
    return from(this._tasksRepository.save(newTask));
  }

  deleteTaskById(id: string): Observable<void> {
    const foundTask$: Observable<TaskEntity> = this.getTaskById(id);
    return foundTask$.pipe(
      map((foundTask: TaskEntity) => {
        from(this._tasksRepository.remove(foundTask));
      }),
    );
  }

  updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Observable<TaskEntity> {
    const { status } = updateTaskStatusDto;
    const foundTask$: Observable<TaskEntity> = this.getTaskById(id);
    return foundTask$.pipe(
      switchMap((foundTask: TaskEntity) => {
        foundTask.status = status;
        return this._tasksRepository.save(foundTask);
      }),
    );
  }
}
