// src/tasks/DTO/update-task.dto.ts
import { TaskStatus } from '../task-status';
import { IsOptional, IsEnum, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  title?: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsEnum(TaskStatus, {
    message: 'Status should be one of OPEN, IN_PROGRESS, DONE',
  })
  status?: TaskStatus;
}
