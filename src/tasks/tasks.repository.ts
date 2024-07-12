import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { AppDataSource } from './data-source';

export class TasksRepository extends Repository<Task> {
  constructor() {
    super(Task, AppDataSource.manager);
  }

  // Tambahkan metode khusus repository di sini
}
