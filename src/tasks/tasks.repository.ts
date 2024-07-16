import { Like, Repository } from 'typeorm';
import { Task } from './task.entity';
import { AppDataSource } from './data-source';
import { CreateTaskDto } from './DTO/create-task.dto';
import { TaskStatus } from './task-status';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateTaskDto } from './DTO/update-task.dto';
import { GetTasksFilterDto } from './DTO/get-tasks-filter.dto';

export class TasksRepository extends Repository<Task> {
  constructor() {
    super(Task, AppDataSource.manager);
  }

  async getAll(): Promise<Task[]> {
    try {
      return await this.find();
    } catch (error) {
      throw new NotFoundException('No tasks found with the provided filters.');
    }
  } 

  async getFilteredTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    const { status, search } = filterDto;
    let query = this.createQueryBuilder('task');

    if (status) {
      query = query.where('task.status = :status', { status });
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
    return tasks;
  }

  async getTaskById(id: string): Promise<Task> {
    const found = await this.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;

    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);
    return task;
  }

  async deleteTask(id: string): Promise<{ message: string; code: number }> {
    const result = await this.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return { code: 200, message: `Task with ID "${id}" successfully deleted` };
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.getTaskById(id);
    const { title, description, status } = updateTaskDto;
    task.title = title;
    task.description = description;
    task.status = status;
    await this.save(task);
    return task;
  }

  // Tambahkan metode khusus repository di sini
}
