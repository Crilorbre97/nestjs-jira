import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator";

export class CreateAnswerDto {
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    @MinLength(3, { message: 'Description must be at least 3 characters long' })
    @MaxLength(255, { message: 'Description can not be longer than 255 characters' })
    response?: string;

    @IsOptional()
    @IsArray({ message: 'Answer options must be an array of numbers' })
    @ArrayMinSize(1, { message: 'At least one answer option must be selected' })
    @ValidateNested({ each: true })
    @Type(() => CreateAnswerOptionDto)
    answerOptions?: CreateAnswerOptionDto[];
}

export class CreateAnswerOptionDto {
    @IsNumber({}, { message: 'Option ID must be a number' })
    optionId: number;
}