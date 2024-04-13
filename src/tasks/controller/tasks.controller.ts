import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TasksService } from '../service/tasks.service';
import { Observable } from 'rxjs';
import { TaskInterface } from '../interface/task.interface';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskStatusEnum } from '../enum/task-status.enum';
import { FilterTaskDto } from '../dto/filter-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly _tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterTaskDto: FilterTaskDto): Observable<TaskInterface[]> {
    if (Object.keys(filterTaskDto).length) {
      return this._tasksService.getTasksWithFilters(filterTaskDto);
    } else {
      return this._tasksService.getAllTasks();
    }
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Observable<TaskInterface> {
    return this._tasksService.getTaskById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTask(@Body() createTaskDto: CreateTaskDto): Observable<TaskInterface> {
    return this._tasksService.createTask(createTaskDto);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatusEnum,
  ): Observable<TaskInterface> {
    return this._tasksService.updateTaskStatus(id, status);
  }

  @Delete(':id')
  deleteTaskById(@Param('id') id: string): Observable<void> {
    return this._tasksService.deleteTaskById(id);
  }
}
