import { IsString, Matches, Max, MaxLength, Min, MinLength } from "class-validator";

export class AuthCrediventialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(20, { message: 'Password cannot be longer than 20 characters' })
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, {
      message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
    })
    password: string;
} 