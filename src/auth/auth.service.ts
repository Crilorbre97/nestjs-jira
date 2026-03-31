import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from 'src/auth/dto/create-user.dto';
import { UserAccount, UserAccountRole } from 'src/users/entities/user-account.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bycrypt from 'bcrypt'
import { CreateUserResponseDTO } from './dto/create-user-response.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserAccount)
        private userAccountRepository: Repository<UserAccount>
    ) { }

    async create(dto: CreateUserDTO): Promise<CreateUserResponseDTO> {
        const existingUser = await this.userRepository.findOne({
            where: { email: dto.email }
        })

        if (existingUser) {
            throw new ConflictException("Email already in use. Please, try with a different email")
        }

        const existingUserAccount = await this.userAccountRepository.findOne({
            where: { username: dto.username }
        })

        if (existingUserAccount) {
            throw new ConflictException("Username alredy in use. Please, try with different username")
        }

        const hashedPassword = await this.hashPassword(dto.password)

        const newUserAccount = this.userAccountRepository.create({
            username: dto.username,
            password: hashedPassword,
            role: UserAccountRole.USER
        })

        const newUser = this.userRepository.create(dto)
        newUser.userAccount = newUserAccount
        const user = await this.userRepository.save(newUser)

        return this.mapCreateResponse(user)
    }

    private async hashPassword(password: string): Promise<string> {
        return await bycrypt.hash(password, 10)
    }

    private mapCreateResponse(user: User): CreateUserResponseDTO {
        return {
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            userAccount: {
                id: user.userAccount.id,
                username: user.userAccount.username,
                role: user.userAccount.role,
                createdAt: user.userAccount.createdAt,
                updatedAt: user.userAccount.updatedAt,
            }
        }
    }
}
