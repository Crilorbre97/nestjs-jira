import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { UserGender } from "../../users/entities/user.entity";
import { MathPasswords } from "../decorators/match-passwords.decorator"

export class CreateUserDTO {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    @MinLength(3, { message: 'Name must be at least 8 characters long' })
    @MaxLength(50, { message: 'Name can not be longer than 50 characters' })
    name: string;

    @IsNotEmpty({ message: 'Lastname is required' })
    @IsString({ message: 'Lastname must be a string' })
    @MinLength(3, { message: 'Lastname must be at least 8 characters long' })
    @MaxLength(50, { message: 'Lastname can not be longer than 50 characters' })
    lastname: string;

    @IsEmail({}, { message: 'Please, provide a valid email' })
    email: string;

    @IsNotEmpty({ message: 'Phone is required' })
    @IsString({ message: 'Phone must be a string' })
    @MinLength(8, { message: 'Phone must be at least 8 characters long' })
    @MaxLength(64, { message: 'Phone can not be longer than 64 characters' })
    @Matches(/^(?:\+34|34)?[6-9]\d{8}$/gm, {
        message:
            'Phone must be at least 9 characters long. Prefix is optional',
    })
    phone: string;

    @IsEnum(UserGender, { message: "Gender must be one of: male, female or other" })
    gender: UserGender;

    @IsNotEmpty({ message: 'Username is required' })
    @IsString({ message: 'Username must be a string' })
    @MinLength(3, { message: 'Username must be at least 8 characters long' })
    @MaxLength(50, { message: 'Username can not be longer than 50 characters' })
    username: string;

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password must be a string' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(64, { message: 'Password can not be longer than 64 characters' })
    @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{8,64}$/gm, {
        message:
            'Password must be between 6 and 64 characters long with 1 special character and 1 capital character',
    })
    password: string

    @IsNotEmpty({ message: 'Confirm password is required' })
    @IsString({ message: 'Confirm password must be a string' })
    @MathPasswords('password', { message: 'Passwords do not match', })
    confirmPassword: string
}