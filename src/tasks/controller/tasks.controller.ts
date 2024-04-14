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
  UseGuards,
} from '@nestjs/common';
import { TasksService } from '../service/tasks.service';
import { Observable } from 'rxjs';
import { TaskEntity } from '../entity/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskStatusDto } from '../dto/update-task-status.dto';
import { FilterTaskDto } from '../dto/filter-task.dto';
import { JwtGuard } from '../../auth/guard/jwt.guard';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TasksController {
  constructor(private readonly _tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterTaskDto: FilterTaskDto): Observable<TaskEntity[]> {
    if (Object.keys(filterTaskDto).length) {
      return this._tasksService.getTasksWithFilters(filterTaskDto);
    } else {
      return this._tasksService.getAllTasks();
    }
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Observable<TaskEntity> {
    return this._tasksService.getTaskById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTask(@Body() createTaskDto: CreateTaskDto): Observable<TaskEntity> {
    return this._tasksService.createTask(createTaskDto);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Observable<TaskEntity> {
    return this._tasksService.updateTaskStatus(id, updateTaskStatusDto);
  }

  @Delete(':id')
  deleteTaskById(@Param('id') id: string): Observable<void> {
    return this._tasksService.deleteTaskById(id);
  }
}
