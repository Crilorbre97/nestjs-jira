import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from 'src/auth/dto/create-user.dto';
import { UserAccount, UserAccountRole } from 'src/users/entities/user-account.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bycrypt from 'bcrypt'
import { CreateUserResponseDTO } from './dto/create-user-response.dto';
import { LoginUserDTO } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginUserResponseDTO } from './dto/login-user.response.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserAccount)
        private userAccountRepository: Repository<UserAccount>,
        private jstService: JwtService
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

    async login(dto: LoginUserDTO): Promise<LoginUserResponseDTO> {
        const existingUserAccount = await this.userAccountRepository.findOne({
            where: { username: dto.username },
            relations: ['user']
        })

        if (!existingUserAccount){
            throw new UnauthorizedException("Invalid credentials or account not exists")
        }

        const verifyPassword = await this.verifyPassword(dto.password, existingUserAccount.password)

        if (!verifyPassword){
            throw new UnauthorizedException("Invalid credentials or account not exists")
        }

        return this.generateTokens(existingUserAccount)
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

    private async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bycrypt.compare(plainPassword, hashedPassword)
    }

    private generateTokens(userAccount: UserAccount){
        return {
            accessToken: this.generateAccessToken(userAccount)
        }
    }

    private generateAccessToken(userAccount: UserAccount): string{
        const payload = {
            sub: userAccount.user.id,
            role: userAccount.role
        }
        return this.jstService.sign(payload, {
            expiresIn: '15m'
        })
    }
}
