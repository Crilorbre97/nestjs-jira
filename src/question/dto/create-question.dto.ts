import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength, validate } from "class-validator";
import { QuestionType } from "../entities/question.entity";
import { plainToClass, Type } from "class-transformer";
import { CreateQuestionOptionDto } from "../../question-option/dto/create-question.dto";

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

    @IsOptional()
    questionOptions?: CreateQuestionOptionDto[];

    static async validate(dto: CreateQuestionDto): Promise<string[]> {
        const errors: string[] = [];
        
        if (dto.questionType === QuestionType.OPEN_ANSWER) {
            if (dto.questionOptions !== undefined && dto.questionOptions !== null) {
                errors.push('questionOptions must not be provided for OPEN_ANSWER questions');
            }
        } 
        else if ([QuestionType.MULTIPLE_CHOICE, QuestionType.ONE_CHOICE].includes(dto.questionType)) {
            if (!dto.questionOptions || dto.questionOptions.length === 0) {
                errors.push('questionOptions is required for multiple choice or one choice questions');
            } else {
                // Validar cada opción
                for (let i = 0; i < dto.questionOptions.length; i++) {
                    const opt = dto.questionOptions[i];
                    const optionInstance = plainToClass(CreateQuestionOptionDto, opt);
                    const optionErrors = await validate(optionInstance);
                    if (optionErrors.length > 0) {
                        // Mapear errores para tener contexto del índice
                        optionErrors.forEach(error => {
                            const constraints = error.constraints;
                            if (constraints) {
                                Object.values(constraints).forEach(message => {
                                    errors.push(`Option ${i}: ${message}`);
                                });
                            }
                        });
                    }
                }
                
                // Validar al menos una correcta
                if (!dto.questionOptions.some(opt => opt.isCorrect)) {
                    errors.push('At least one option must be marked as correct');
                }
                
                // Para ONE_CHOICE, validar exactamente una correcta
                if (dto.questionType === QuestionType.ONE_CHOICE) {
                    const correctCount = dto.questionOptions.filter(opt => opt.isCorrect).length;
                    if (correctCount !== 1) {
                        errors.push('ONE_CHOICE questions must have exactly one correct option');
                    }
                }
            }
        }
        
        return errors;
    }
}

