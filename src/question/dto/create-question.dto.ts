import { ArrayMinSize, IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength, Validate, ValidateIf, ValidateNested } from "class-validator";
import { QuestionType } from "../entities/question.entity";
import { Type } from "class-transformer";
import { CreateQuestionOptionDto } from "src/question-option/dto/create-question.dto";
import { AtLeastOneCorrect } from "../decorators/at-least-one-correct.decorator";

export class CreateQuestionDto {
    @IsNotEmpty({ message: 'Title is required' })
    @IsString({ message: 'Title must be a string' })
    @MinLength(3, { message: 'Title must be at least 3 characters long' })
    @MaxLength(255, { message: 'Title can not be longer than 255 characters' })
    title: string;

    @IsNotEmpty({ message: 'Type is required' })
    @IsEnum(QuestionType, { message: 'Type must be one of: multiple_choice, one_choice, open_answer' })
    questionType: QuestionType;

    @IsNotEmpty({ message: 'Scoreable is required' })
    @IsBoolean({ message: 'Scoreable must be a boolean' })
    scoreable: boolean;

    @IsNotEmpty({ message: 'Score is required' })
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Score must be a number with at most 2 decimal places' })
    score: number;

    @ValidateIf(o => o.questionType === QuestionType.MULTIPLE_CHOICE || o.questionType === QuestionType.ONE_CHOICE)
    @IsNotEmpty({ message: 'Options are required for multiple_choice and one_choice questions' })
    @IsArray({ message: 'Options must be an array' })
    @ArrayMinSize(2, { message: 'At least 2 options are required' })
    @ValidateNested({ each: true })
    @Type(() => CreateQuestionOptionDto)
    @AtLeastOneCorrect({ message: 'At least one option must be marked as correct' })
    options?: CreateQuestionOptionDto[];
}

