import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateQuestionOptionDto {
    @IsNotEmpty({ message: 'Title is required' })
    @IsString({ message: 'Title must be a string' })
    @MinLength(3, { message: 'Title must be at least 3 characters long' })
    @MaxLength(255, { message: 'Title can not be longer than 255 characters' })
    title: string;


    @IsNotEmpty({ message: 'Is Correct is required' })
    @IsBoolean({ message: 'Is Correct must be a boolean' })
    isCorrect: boolean;
}