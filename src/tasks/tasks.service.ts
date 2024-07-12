import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './DTO/create-task.dto';
import { UpdateTaskDto } from './DTO/update-task.dto';
import { GetTasksFilterDto } from './DTO/get-tasks-filter.dto';
import { TasksRepository } from './tasks.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status';

@Injectable()
export class TasksService {
constructor(
    private tasksRepository: TasksRepository,
) {}

async getAll(): Promise<Task[]> {
  return await this.tasksRepository.find();
}

async getFilteredTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
  return await this.tasksRepository.getFilteredTasks(filterDto);
}
async getTaskById(id: string): Promise<Task> {
  return this.tasksRepository.getTaskById(id);
}

async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
  // Perform any business logic here (e.g., validation, default values)
  return this.tasksRepository.createTask(createTaskDto);
}

async deleteTask(id: string): Promise<{ message: string, code: number }> {
  return this.tasksRepository.deleteTask(id);
}

async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
  return this.tasksRepository.updateTask(id, updateTaskDto);
}






///////////////////////////////////////////////////////////////
  // getAllTasks(): Task[] {
  //     return this.tasks
  // }
  // /**
  //  * Returns an array of tasks that match the given filter.
  //  * If no filter is provided, returns all tasks.
  //  *
  //  * @param filterDto - The filter to apply to the tasks.
  //  * @returns An array of tasks that match the filter.
  //  */
  // getTaskWithFilter(filterDto: GetTasksFilterDto): Task[]{
  //     // Extract the filter properties from the filter DTO, or default to empty objects.
  //     const {status, search} = filterDto ?? {}
  //     // Define a temporary array to hold the result.
  //     let tasks = this.getAllTasks() ?? []
  //     // Apply the filters to the tasks array.
  //     // If a status is provided, filter the tasks array to only include tasks with the matching status.
  //     if(status){
  //         tasks = tasks.filter(task => task.status === status || Object.values(TaskStatus).includes(status as TaskStatus));
  //     }
  //     // If a search string is provided, filter the tasks array to only include tasks whose title or description includes the search string.
  //     if(search){
  //         const searchLower = search.toLowerCase();
  //         tasks = tasks.filter((task) => {
  //             const titleLower = task.title?.toLowerCase();
  //             const descriptionLower = task.description?.toLowerCase();
  //             return titleLower.includes(searchLower) || descriptionLower.includes(searchLower);
  //         });
  //     }
  //     // Return the filtered tasks array.
  //     return tasks
  // }
  // getTaskById(id: string): Task{
  //     const found = this.tasks.find((task) => task.id === id)
  //     if(!found){
  //         throw new NotFoundException(`Task with ID "${id}" not found.`)
  //     }
  //     return found
  // }
  // createTask(createTaskDto: CreateTaskDto): Task {
  //     const {title, description} = createTaskDto;
  //     const task: Task = {
  //         id: uuid(),
  //         title,
  //         description,
  //         status: TaskStatus.OPEN
  //     }
  //     this.tasks.push(task)
  //     return task
  // }
  // deleteTask(id: string): void {
  //     const found = this.getTaskById(id)
  //     this.tasks = this.tasks.filter((task) => task.id !== found.id)
  // }
  // // updateTaskStatus(id: string, status: TaskStatus) {
  // //     const task = this.getTaskById(id)
  // //     task.status = status
  // //     return task
  // // }
  // updateTask(id: string, updateTaskDto: UpdateTaskDto): Task{
  //     const task = this.getTaskById(id);
  //     const { title, description, status } = updateTaskDto
  //     if(title){
  //         task.title = title
  //     }
  //     if(description){
  //         task.description = description
  //     }
  //     if(status){
  //         task.status = status
  //     }
  //     return task
  // }
}
