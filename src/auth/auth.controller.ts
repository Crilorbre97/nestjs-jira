import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from 'src/auth/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post("register")
    create(@Body() dto: CreateUserDTO){
        return this.authService.create(dto)
    }

    @Post("login")
    login(@Body() dto: LoginUserDTO){
        return this.authService.login(dto)
    }
}
