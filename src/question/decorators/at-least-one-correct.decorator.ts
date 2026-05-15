import { registerDecorator, ValidationOptions } from "class-validator";
import { CreateQuestionOptionDto } from "src/question-option/dto/create-question.dto";

export function AtLeastOneCorrect(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'AtLeastOneCorrect',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            validator: {
                validate(value: CreateQuestionOptionDto[], args) {
                    return Array.isArray(value) && value.some(option => option.isCorrect);
                }
            }
        })
    }
        
}