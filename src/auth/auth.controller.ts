import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTO } from 'src/auth/dto/create-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post()
    create(@Body() dto: CreateUserDTO){
        return this.authService.create(dto)
    }
}
