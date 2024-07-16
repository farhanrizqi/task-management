import { AppDataSource } from "src/tasks/data-source";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { ConflictException, InternalServerErrorException, Logger, NotFoundException } from "@nestjs/common";
import { AuthCredentialsDto } from "./DTO/auth-credentials.dto";


export class UsersRepository extends Repository<User>{
  private readonly logger = new Logger(UsersRepository.name);
    constructor() {
        super(User, AppDataSource.manager);
      }

      async getAll(): Promise<User[]> {
        return await this.find();
      }

      async getUserById(id: string): Promise<User> {
        const found = await this.findOne({ where: { id } });
        if (!found) {
          throw new NotFoundException(`User with ID "${id}" not found`);
        }
        return found;
      }
      
      async createUser(authCredentialsDto: AuthCredentialsDto): Promise<User> {
        const { username, password } = authCredentialsDto;
        const user = this.create({ username, password });
    
        try {
          // this.logger.log('Creating user:', JSON.stringify(user));
          await this.save(user);
          return user;
        } catch (error) {
          // this.logger.error('Error creating user:', error);
          if (error.code === '23505') {
            throw new ConflictException('Username already exists');
          } else {
            throw new InternalServerErrorException('Error saving user to database');
          }
        }
      }
    
}