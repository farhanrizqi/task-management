import {
  Body,
  Controller,
  Post,
  Logger,
  UnauthorizedException,
  InternalServerErrorException
} from '@nestjs/common';
import { AuthCredentialsDto } from './DTO/auth-credentials.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { LoginCredentialsDto } from './DTO/login-credentials.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ user: User; message: string }> {
    const result = await this.authService.signUp(authCredentialsDto);
    return result;
    // this.logger.log('Received request:', JSON.stringify(authCredentialsDto));
    // this.logger.log('Signup successful:', JSON.stringify(result));

    // *Different Logic
    // try {
    //   return await this.authService.signUp(authCredentialsDto);
    // } catch (error) {
    //   throw new InternalServerErrorException('Failed to create user');
    // }
  }

  @Post('/login')
  async login(
    @Body() loginCredentialsDto: LoginCredentialsDto,
  ): Promise<{ message: string; token: string }> {
    try {
        return await this.authService.login(loginCredentialsDto);
      } catch (error) {
        if (error instanceof UnauthorizedException) {
          throw new UnauthorizedException('Invalid credentials');
        } else if (error instanceof InternalServerErrorException) {
          throw error; // Rethrow InternalServerErrorException directly
        } else {
            this.logger.log(error)
          // Handle other unexpected errors
          throw new InternalServerErrorException('Unexpected error occurred');
        }
      }
  }
}
