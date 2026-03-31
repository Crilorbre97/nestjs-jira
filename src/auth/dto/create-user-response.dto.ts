export class CreateUserResponseDTO {
    id: number;
    name: string;
    lastname: string;
    email: string;
    phone: string;
    gender: string;
    createdAt: Date;
    updatedAt: Date;
    userAccount: {
        id: number;
        username: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }
}