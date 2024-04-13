import { TaskStatusEnum } from '../enum/task-status.enum';

export interface TaskInterface {
  id: string;
  title: string;
  description: string;
  status: TaskStatusEnum;
}
