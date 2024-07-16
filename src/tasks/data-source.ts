import { DataSource } from 'typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'admin',
  database: 'task-management',
  entities: [Task, User],
  synchronize: true,
});
