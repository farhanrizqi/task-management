import { AppDataSource } from 'src/data-source';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import {
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './DTO/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

export class UsersRepository extends Repository<User> {
  private readonly logger = new Logger(UsersRepository.name);
    constructor(private jwtService: JwtService) {
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

  async createUser(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ user: User; message: string }> {
    const { username, password } = authCredentialsDto;

    // hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.create({ username, password: hashedPassword });

    try {
      await this.save(user);
      return { user, message: 'User created successfully' };
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
