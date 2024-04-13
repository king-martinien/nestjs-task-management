import { Injectable, NotFoundException } from '@nestjs/common';
import { map, Observable, of } from 'rxjs';
import { TaskInterface } from '../interface/task.interface';
import { TaskStatusEnum } from '../enum/task-status.enum';
import * as crypto from 'crypto';
import { CreateTaskDto } from '../dto/create-task.dto';
import { FilterTaskDto } from '../dto/filter-task.dto';
import { UpdateTaskStatusDto } from '../dto/update-task-status.dto';

@Injectable()
export class TasksService {
  private _tasks: TaskInterface[] = [];

  getAllTasks(): Observable<TaskInterface[]> {
    return of(this._tasks);
  }

  getTasksWithFilters(
    filterTaskDto: FilterTaskDto,
  ): Observable<TaskInterface[]> {
    const { search, status } = filterTaskDto;
    let filteredTasks: TaskInterface[] = [...this._tasks];
    if (search) {
      filteredTasks = filteredTasks.filter(
        (task: TaskInterface) =>
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (status) {
      filteredTasks = filteredTasks.filter(
        (task: TaskInterface) => task.status === status,
      );
    }
    return of(filteredTasks);
  }

  getTaskById(id: string): Observable<TaskInterface> {
    const foundTask = this._tasks.find((task: TaskInterface) => task.id === id);
    if (!foundTask) {
      throw new NotFoundException(`Task not found with id ${id}`);
    }
    return of(foundTask);
  }

  createTask(createTaskDto: CreateTaskDto): Observable<TaskInterface> {
    const { title, description } = createTaskDto;

    const newTask: TaskInterface = {
      id: crypto.randomUUID(),
      title,
      description,
      status: TaskStatusEnum.OPEN,
    };

    this._tasks.push(newTask);
    return of(newTask);
  }

  updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
  ): Observable<TaskInterface> {
    const { status } = updateTaskStatusDto;
    const foundTask$: Observable<TaskInterface> = this.getTaskById(id);

    return foundTask$.pipe(
      map((foundTask: TaskInterface) => {
        foundTask.status = status;
        this._tasks.map((task: TaskInterface) => {
          if (task.id === foundTask.id) {
            task.status = status;
          }
        });
        return foundTask;
      }),
    );
  }

  deleteTaskById(id: string): Observable<void> {
    const foundTask$: Observable<TaskInterface> = this.getTaskById(id);
    return foundTask$.pipe(
      map((foundTask: TaskInterface) => {
        this._tasks = this._tasks.filter((task) => task.id !== foundTask.id);
      }),
    );
  }
}
