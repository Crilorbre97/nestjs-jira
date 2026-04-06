import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthProducer } from './producer/auth.producer';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly authProducer: AuthProducer) { }

    @Post("register")
    create(@Body() dto: CreateUserDTO) {
        return this.authService.create(dto)
    }

    @Post("login")
    @HttpCode(200)
    login(@Body() dto: LoginUserDTO) {
        return this.authService.login(dto)
    }

    @UseGuards(JwtAuthGuard)
    @Get("profile")
    async profile(@CurrentUser() user) {
        await this.authProducer.fetchAvatarUrl({ userId: user.id })
        return user
    }
}
