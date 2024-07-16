import { IsNotEmpty, IsString, MaxLength, MinLength, Matches } from 'class-validator';

export class AuthCredentialsDto {
    @IsNotEmpty()
    @IsString()
    @MinLength(4, {
        message: 'Username is too short. It should be at least 4 characters long.',
    })
    @MaxLength(20, {
        message: 'Username is too long. It should be at most 20 characters long.',
    })
    username: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(8, {
        message: 'Password is too short. It should be at least 8 characters long.',
    })
    @MaxLength(32, {
        message: 'Password is too long. It should be at most 32 characters long.',
    })
    @Matches(/(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)/, {
        message: 'Password is too weak. It should contain at least one uppercase letter, one lowercase letter, and one number.',
    }) 
    password: string;
}
