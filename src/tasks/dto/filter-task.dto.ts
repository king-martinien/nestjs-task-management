import { TaskStatusEnum } from '../enum/task-status.enum';
import { IsEnum, IsOptional } from 'class-validator';

export class FilterTaskDto {
  @IsOptional()
  search?: string;

  @IsOptional()
  @IsEnum(TaskStatusEnum)
  status?: TaskStatusEnum;
}
