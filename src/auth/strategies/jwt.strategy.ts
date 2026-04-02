import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { AuthService } from "../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService, configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow<string>('jwt.secret')
        })
    }

    async validate(payload): Promise<User> {
        try {
            const user = await this.authService.findUser(payload.sub)
            return {
                ...user
            }
        } catch (error) {
            throw new UnauthorizedException("Invalid token")
        }
    }
}