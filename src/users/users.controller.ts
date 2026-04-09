import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {

    @UseGuards(JwtAuthGuard)
    @Get("profile")
    async profile(@CurrentUser() user) {
        return user
    }

}
