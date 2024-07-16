import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './DTO/create-task.dto';
import { UpdateTaskDto } from './DTO/update-task.dto';
import { GetTasksFilterDto } from './DTO/get-tasks-filter.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  async getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    try {
      if (Object.keys(filterDto).length === 0) {
        return await this.tasksService.getAll();
      } else {
        return await this.tasksService.getFilteredTasks(filterDto);
      }
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof InternalServerErrorException) {
        throw error; // Rethrow the caught error to let Nest handle it
      } else {
        throw new InternalServerErrorException('Internal server error');
      }
    }
  }
  
  @Get('/:id')
  getTaskById(@Param('id') id:string): Promise<Task>{
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string): Promise<{ message: string, code: number }> {
    return this.tasksService.deleteTask(id);
  }

  @Put('/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }






  //////////////////////////////////////////////////////////////////////////////////////
  // @Get()
  // getTasks(@Query() filterDto?: GetTasksFilterDto): Task[] {
  //   if (Object.keys(filterDto).length) {
  //     return this.tasksService.getTaskWithFilter(filterDto);
  //   } else {
  //     return this.tasksService.getAllTasks();
  //   }
  // }

  // @Get('/:id')
  // getTaskById(@Param('id') id: string): Task {
  //   return this.tasksService.getTaskById(id);
  // }

  // @Post()
  // createTask(@Body() createTaskDto: CreateTaskDto): Task {
  //   return this.tasksService.createTask(createTaskDto);
  // }

  // @Delete('/:id')
  // deleteTask(@Param('id') id: string): void {
  //   this.tasksService.deleteTask(id);
  // }

  // @Put('/:id')
  // updateTask(
  //   @Param('id') id: string,
  //   @Body() updateTaskDto: UpdateTaskDto,
  // ): Task {
  //   return this.tasksService.updateTask(id, updateTaskDto);
  // }
}

// Helper functions
// function Query(): (target: TasksController, propertyKey: "getTasks", parameterIndex: 0) => void {
//   return Query();
// }
