import { INestApplication } from "@nestjs/common";
import { CreateUserDTO } from "src/auth/dto/create-user.dto";
import { App } from "supertest/types";
import { DataSource } from "typeorm";
import { createUser } from "./factories/user.factory";
import { LoginUserDTO } from "src/auth/dto/login-user.dto";
import * as request from 'supertest';

export const loginUser = async (dataSource: DataSource, dto: CreateUserDTO, app: INestApplication<App>) => {
    await createUser(dataSource, dto)

    const loginDto: LoginUserDTO = {
        username: dto.username,
        password: dto.password
    }
    const loginResponse = await request(app.getHttpServer()).post('/auth/login').send(loginDto)
    return loginResponse.body.accessToken
}