import { UserAccountRole } from "../../../src/users/entities/user-account.entity"
import { CreateUserDTO } from "../../../src/auth/dto/create-user.dto"
import { User } from "../../../src/users/entities/user.entity"
import { DataSource } from "typeorm"
import * as bycrypt from 'bcrypt'

export const createUser = async (dataSource: DataSource, data: CreateUserDTO): Promise<User> => {
    const repository = dataSource.getRepository(User)

    const { name, lastname, email, phone, gender, username, password } = data 

    return repository.save({
        name,
        lastname,
        email,
        phone,
        gender,
        userAccount: {
            username,
            password: await bycrypt.hash(password, 10),
            role: UserAccountRole.USER
        }
    })
}