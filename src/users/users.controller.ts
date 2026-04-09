import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {

    @UseGuards(JwtAuthGuard)
    @Get("profile")
    async profile(@CurrentUser() user) {
        return user
    }

}
