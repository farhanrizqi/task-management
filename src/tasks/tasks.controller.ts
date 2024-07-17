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
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // @Get()
  // async getTasks(@Query() filterDto: GetTasksFilterDto, @GetUser() user:User): Promise<Task[]> {
  //   try {
  //     if (Object.keys(filterDto).length === 0) {
  //       return await this.tasksService.getAll(user);
  //     } else {
  //       return await this.tasksService.getFilteredTasks(filterDto, user);
  //     }
  //   } catch (error) {
  //     if (error instanceof NotFoundException || error instanceof InternalServerErrorException) {
  //       throw error;
  //     } else {
  //       throw new InternalServerErrorException('Internal server error');
  //     }
  //   }
  // }

  @Get()
  async getTasks(@Query()filterDto: GetTasksFilterDto, @GetUser() user:User): Promise<{code: number, message: string, data: Task[]}> {
    return await this.tasksService.getFilteredTasks(filterDto, user);
  }

  
  @Get('/:id')
  getTaskById(@Param('id') id:string, @GetUser() user: User): Promise<{code: number, message: string, data: Task}>{
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser()user:User): Promise<{code: number, message: string, data: Task}> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Put('/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: User
  ): Promise<{code: number, message: string, data: Task}> {
    return this.tasksService.updateTask(id, updateTaskDto, user);
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string, @GetUser() user: User): Promise<{ message: string, code: number }> {
    return this.tasksService.deleteTask(id, user);
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
