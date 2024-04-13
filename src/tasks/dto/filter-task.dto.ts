import { TaskStatusEnum } from '../enum/task-status.enum';

export class FilterTaskDto {
  search?: string;
  status?: TaskStatusEnum;
}
