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
import { GetUserDecorator } from '../../auth/decorator/get-user.decorator';
import { UserEntity } from '../../auth/entity/user.entity';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TasksController {
  constructor(private readonly _tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query() filterTaskDto: FilterTaskDto,
    @GetUserDecorator() user: UserEntity,
  ): Observable<TaskEntity[]> {
    return this._tasksService.getTasks(filterTaskDto, user);
  }

  @Get(':id')
  getTaskById(
    @Param('id') id: string,
    @GetUserDecorator() user: UserEntity,
  ): Observable<TaskEntity> {
    return this._tasksService.getTaskById(id, user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUserDecorator() user: UserEntity,
  ): Observable<TaskEntity> {
    return this._tasksService.createTask(createTaskDto, user);
  }

  @Patch(':id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUserDecorator() user: UserEntity,
  ): Observable<TaskEntity> {
    return this._tasksService.updateTaskStatus(id, updateTaskStatusDto, user);
  }

  @Delete(':id')
  deleteTaskById(
    @Param('id') id: string,
    @GetUserDecorator() user: UserEntity,
  ): Observable<void> {
    return this._tasksService.deleteTaskById(id, user);
  }
}
