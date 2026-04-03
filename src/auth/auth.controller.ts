import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

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

    @UseGuards(JwtAuthGuard)
    @Get("profile")
    profile(@CurrentUser() user){
        return user
    }
}
