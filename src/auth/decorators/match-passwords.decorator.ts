import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

export function MathPasswords(property: string, validationOptions?: ValidationOptions) {
    // object → the DTO prototype
    // propertyName → "confirmPassword"
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'MatchPassword',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    return value === relatedValue;
                },
            },
        })
    }
}