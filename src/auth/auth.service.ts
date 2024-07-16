import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './DTO/auth-credentials.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor( 
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository
    ) {}

    async getAllUsers(): Promise<User[]> {
        return await this.usersRepository.getAll();
    }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<{ user: User; message: string }> {
        // this.logger.log('Received request in service:', JSON.stringify(authCredentialsDto));
        const user = await this.usersRepository.createUser(authCredentialsDto);
        // this.logger.log('User created:', JSON.stringify(user));
        return { user, message: 'User created successfully' };
    }
}
