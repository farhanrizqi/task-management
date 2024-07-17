import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { AppDataSource } from 'src/data-source';
import { CreateTaskDto } from './DTO/create-task.dto';
import { TaskStatus } from './task-status';
import { NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './DTO/update-task.dto';
import { GetTasksFilterDto } from './DTO/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

export class TasksRepository extends Repository<Task> {
  constructor() {
    super(Task, AppDataSource.manager);
  }

  // async getAll(user:User): Promise<Task[]> {
  //   const query = this.createQueryBuilder('task')
  //   query.where('task.userId = :userId', { userId: user.id })
  //   try {
  //     return await this.find();
  //   } catch (error) {
  //     throw new NotFoundException('No tasks found with the provided filters.');
  //   }
  // } 

  async getFilteredTasks(filterDto: GetTasksFilterDto, user:User): Promise<{code: number, message: string, data: Task[]}> {
    const { status, search } = filterDto;
    let query = this.createQueryBuilder('task');
    query.where({user})

    if (status) {
      query = query.andWhere('task.status = :status', { status });
    }

    if (search) {
      const fuzzySearch = `%${search.split('').join('%')}%`; // Konversi ke format fuzzy search
      query = query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: fuzzySearch },
      );
    }
    const tasks = await query.getMany();
    if (!tasks || tasks.length === 0) {
      throw new NotFoundException('No tasks found with the provided filters.');
    }
    return {
      code: 200,
      message: 'Tasks found',
      data: tasks
    };
  }

  async getTaskById(id: string, user:User): Promise<{code: number, message: string, data: Task}> {
    const found = await this.findOne({ where: { id, user } });
    if (!found) {
      throw new NotFoundException(`Task not found`);
    }
    return {
      code: 200,
      message: 'Task found',
      data: found
    };
  }

  async createTask(createTaskDto: CreateTaskDto, user:User): Promise<{code: number, message: string, data: Task}> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    await this.save(task);
    return {
      code: 201,
      message: 'Task Created Successfully',
      data: task
    };
  }

  async deleteTask(id: string, user: User): Promise<{ code: number, message: string}> {
    const result = await this.delete({id, user});
    if (result.affected === 0) {
      throw new NotFoundException(`Task not found`);
    }
    return { code: 200, message: `Task successfully deleted` };
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto, user:User): Promise<{code: number, message: string, data: Task}> {
    const task = await this.getTaskById(id, user);
    const { title, description, status } = updateTaskDto;
    task.data.title = title;
    task.data.description = description;
    task.data.status = status;
    await this.save(task.data);
    return {
      code: 200,
      message: 'Task Updated Successfully',
      data: task.data
    };
  }

  // Tambahkan metode khusus repository di sini
}
