import { IsNotEmpty, IsString } from "class-validator"
import { TaskStatus } from "../task-status"

export class CreateTaskDto{
    @IsNotEmpty()
    @IsString()
    title: string
    
    @IsNotEmpty()
    @IsString()
    description: string
}