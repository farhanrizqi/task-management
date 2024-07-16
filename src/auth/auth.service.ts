import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './DTO/auth-credentials.dto';
import { User } from './user.entity';
import { LoginCredentialsDto } from './DTO/login-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  //   private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService
  ) {}

  async getAllUsers(): Promise<User[]> {
    return await this.usersRepository.getAll();
  }

  async signUp(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ user: User; message: string }> {
    return this.usersRepository.createUser(authCredentialsDto);

    // * Different logic
    // this.logger.log('Received request in service:', JSON.stringify(authCredentialsDto));
    // const user = await this.usersRepository.createUser(authCredentialsDto);
    // this.logger.log('User created:', JSON.stringify(user));
    // return { user, message: 'User created successfully' };
  }

  async login(
    loginCredentialsDto: LoginCredentialsDto,
  ): Promise<{ message: string; token: string }> {
    const { username, password } = loginCredentialsDto;

    const user = await this.usersRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const token = this.jwtService.sign(payload); // Pastikan jwtService sudah diinisialisasi dengan benar

      return { message: 'Login Success', token };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }

    // * Different logic
    // const user = await this.usersRepository.login(authCredentialsDto);
    // return user
  }
}
