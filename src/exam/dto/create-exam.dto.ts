import { IsNotEmpty, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreateExamDTO {
    @IsNotEmpty({ message: 'Title is required' })
    @IsString({ message: 'Title must be a string' })
    @MinLength(3, { message: 'Title must be at least 3 characters long' })
    @MaxLength(50, { message: 'Title can not be longer than 50 characters' })
    title: string;

    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    @MinLength(3, { message: 'Description must be at least 3 characters long' })
    @MaxLength(255, { message: 'Description can not be longer than 255 characters' })
    description?: string;

}