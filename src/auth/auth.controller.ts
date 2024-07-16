import { Body, Controller, Post, Logger } from '@nestjs/common';
import { AuthCredentialsDto } from './DTO/auth-credentials.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    constructor(private authService: AuthService){}
    
    @Post('/signup')
    async signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<{ user: User; message: string }> {
        // this.logger.log('Received request:', JSON.stringify(authCredentialsDto));
        const result = await this.authService.signUp(authCredentialsDto);
        // this.logger.log('Signup successful:', JSON.stringify(result));
        return result;
    }
}
