import { INestApplication } from "@nestjs/common";
import { CreateUserDTO } from "src/auth/dto/create-user.dto";
import { App } from "supertest/types";
import { DataSource } from "typeorm";
import { createUser } from "./factories/user.factory";
import { LoginUserDTO } from "src/auth/dto/login-user.dto";
import * as request from 'supertest';
import { UserGender } from "../../src/users/entities/user.entity";

export const loginUser = async (dataSource: DataSource, app: INestApplication<App>) => {
    const dto: CreateUserDTO = {
        name: "name",
        lastname: "lastname",
        email: "email@gmail.com",
        phone: "666666666",
        gender: UserGender.MALE,
        username: "username",
        password: "Cristi@na1",
        confirmPassword: "Cristi@na1"
    }

    await createUser(dataSource, dto)

    const loginDto: LoginUserDTO = {
        username: dto.username,
        password: dto.password
    }
    const loginResponse = await request(app.getHttpServer()).post('/auth/login').send(loginDto)
    return loginResponse.body.accessToken
}