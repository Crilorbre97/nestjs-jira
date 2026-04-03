import { Test, TestingModule } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { EntityNotFoundError, Repository } from "typeorm";
import { User, UserGender } from "../users/entities/user.entity";
import { UserAccount, UserAccountRole } from "../users/entities/user-account.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDTO } from "./dto/create-user.dto";
import { CreateUserResponseDTO } from "./dto/create-user-response.dto";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { LoginUserDTO } from "./dto/login-user.dto";
import * as bcrypt from 'bcrypt';

describe("AuthService", () => {
    let service: AuthService;
    let jwtService: JwtService;
    let userRepository: Repository<User>
    let userAccountRepository: Repository<UserAccount>

    const mockJwtService = {
        sign: jest.fn()
    }

    const mockUserRepository = {
        findOne: jest.fn(),
        findOneOrFail: jest.fn(),
        create: jest.fn(),
        save: jest.fn()
    }

    const mockUserAccountRepository = {
        findOne: jest.fn(),
        create: jest.fn()
    }

    const mockUser: User = {
        id: 1,
        name: "name",
        lastname: "lastname",
        email: "email",
        phone: "phone",
        gender: UserGender.MALE,
        createdAt: new Date(),
        updatedAt: new Date(),
        userAccount: {
            id: 1,
            username: "username",
            password: "password",
            role: UserAccountRole.USER,
            createdAt: new Date(),
            updatedAt: new Date(),
            user: undefined as any
        }
    }

    const mockUserAccount: UserAccount = {
        id: 1,
        username: "username",
        password: "password",
        role: UserAccountRole.USER,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
            id: 1,
            name: "name",
            lastname: "lastname",
            email: "email",
            phone: "phone",
            gender: UserGender.MALE,
            createdAt: new Date(),
            updatedAt: new Date(),
            userAccount: undefined as any
        }
    }

    const mockCreateUserResponse: CreateUserResponseDTO = {
        id: 1,
        name: "name",
        lastname: "lastname",
        email: "email",
        phone: "phone",
        gender: UserGender.MALE,
        createdAt: new Date(),
        updatedAt: new Date(),
        userAccount: {
            id: 1,
            username: "username",
            role: UserAccountRole.USER,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    }

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: mockJwtService
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository
                },
                {
                    provide: getRepositoryToken(UserAccount),
                    useValue: mockUserAccountRepository
                },

            ]
        }).compile()

        service = module.get<AuthService>(AuthService)
        jwtService = module.get<JwtService>(JwtService)
        userRepository = module.get<Repository<User>>(getRepositoryToken(User))
        userAccountRepository = module.get<Repository<UserAccount>>(getRepositoryToken(UserAccount))
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create user', async () => {
        const dto: CreateUserDTO = {
            name: "Name",
            lastname: "Lastname",
            email: "email",
            phone: "phone",
            gender: UserGender.MALE,
            username: "username",
            password: "password",
            confirmPassword: "password"
        }
        const spyFindOneUser = jest.spyOn(userRepository, "findOne").mockImplementation(() => Promise.resolve(null))
        const spyFindOneUserAccount = jest.spyOn(userAccountRepository, "findOne").mockImplementation(() => Promise.resolve(null))
        const spyCreateUserAccount = jest.spyOn(userAccountRepository, "create").mockImplementation(() => new UserAccount())
        const spyCreateUser = jest.spyOn(userRepository, "create").mockImplementation(() => new User())
        const spySaveUser = jest.spyOn(userRepository, "save").mockImplementation(() => Promise.resolve(mockUser))
        const result = await service.create(dto)

        expect(spyFindOneUser).toHaveBeenCalled()
        expect(spyFindOneUser).toHaveBeenCalledWith({"where": {"email": "email"}})
        expect(spyFindOneUserAccount).toHaveBeenCalled()
        expect(spyFindOneUserAccount).toHaveBeenCalledWith({"where": {"username": "username"}})
        expect(spyCreateUserAccount).toHaveBeenCalled()
        expect(spyCreateUser).toHaveBeenCalled()
        expect(spySaveUser).toHaveBeenCalled()
        expect(result).toEqual(mockCreateUserResponse)
    })

    it('should throw exception when user with email is already created', async () => {
        const dto: CreateUserDTO = {
            name: "Name",
            lastname: "Lastname",
            email: "email",
            phone: "phone",
            gender: UserGender.MALE,
            username: "username",
            password: "password",
            confirmPassword: "password"
        }
        const spyFindOneUser = jest.spyOn(userRepository, "findOne").mockRejectedValue(new ConflictException(`Email already in use. Please, try with a different email`))
        const spyFindOneUserAccount = jest.spyOn(userAccountRepository, "findOne")
        const spyCreateUserAccount = jest.spyOn(userAccountRepository, "create")
        const spyCreateUser = jest.spyOn(userRepository, "create")
        const spySaveUser = jest.spyOn(userRepository, "save")
        await expect(service.create(dto)).rejects.toThrow(ConflictException);
        await expect(service.create(dto)).rejects.toThrow("Email already in use. Please, try with a different email");

        expect(spyFindOneUser).toHaveBeenCalled()
        expect(spyFindOneUser).toHaveBeenCalledWith({"where": {"email": "email"}})
        expect(spyFindOneUserAccount).toHaveBeenCalledTimes(0)
        expect(spyCreateUserAccount).toHaveBeenCalledTimes(0)
        expect(spyCreateUser).toHaveBeenCalledTimes(0)
        expect(spySaveUser).toHaveBeenCalledTimes(0)
    })

    it('should throw exception when user with username is already created', async () => {
        const dto: CreateUserDTO = {
            name: "Name",
            lastname: "Lastname",
            email: "email",
            phone: "phone",
            gender: UserGender.MALE,
            username: "username",
            password: "password",
            confirmPassword: "password"
        }
        const spyFindOneUser = jest.spyOn(userRepository, "findOne").mockImplementation(() => Promise.resolve(null))
        const spyFindOneUserAccount = jest.spyOn(userAccountRepository, "findOne").mockRejectedValue(new ConflictException(`Username alredy in use. Please, try with different username`))
        const spyCreateUserAccount = jest.spyOn(userAccountRepository, "create")
        const spyCreateUser = jest.spyOn(userRepository, "create")
        const spySaveUser = jest.spyOn(userRepository, "save")
        await expect(service.create(dto)).rejects.toThrow(ConflictException);
        await expect(service.create(dto)).rejects.toThrow("Username alredy in use. Please, try with different username");

        expect(spyFindOneUser).toHaveBeenCalled()
        expect(spyFindOneUser).toHaveBeenCalledWith({"where": {"email": "email"}})
        expect(spyFindOneUserAccount).toHaveBeenCalled()
        expect(spyFindOneUserAccount).toHaveBeenCalledWith({"where": {"username": "username"}})
        expect(spyCreateUserAccount).toHaveBeenCalledTimes(0)
        expect(spyCreateUser).toHaveBeenCalledTimes(0)
        expect(spySaveUser).toHaveBeenCalledTimes(0)
    })

    it('should login user', async () => {
       const dto: LoginUserDTO = {
        username: "username",
        password: "password"
       }
       const spyFindOneUserAccount = jest.spyOn(userAccountRepository, "findOne").mockImplementation(() => Promise.resolve(mockUserAccount))
       const spyBcrypt = jest.spyOn(bcrypt, "compare").mockImplementation(() => Promise.resolve(true))
       const spySignJwt = jest.spyOn(jwtService, "sign").mockImplementation(() => "token")
       const result = await service.login(dto)

       expect(spyFindOneUserAccount).toHaveBeenCalled()
       expect(spyFindOneUserAccount).toHaveBeenCalledWith({"where": {"username": "username"}, "relations": ['user']})
       expect(spyBcrypt).toHaveBeenCalled()
       expect(spyBcrypt).toHaveBeenCalledWith("password", "password")
       expect(spySignJwt).toHaveBeenCalled()
       expect(spySignJwt).toHaveBeenCalledWith({"role": "user", "sub": 1}, {"expiresIn": "15m"})
       expect(result).toEqual({"accessToken": "token"})
    })

    it('should throw exception when user not found', async () => {
       const dto: LoginUserDTO = {
        username: "username",
        password: "password"
       }
       const spyFindOneUserAccount = jest.spyOn(userAccountRepository, "findOne").mockRejectedValue(new UnauthorizedException(`Invalid credentials or account not exists`))
       const spyBcrypt = jest.spyOn(bcrypt, "compare")
       const spySignJwt = jest.spyOn(jwtService, "sign")

       await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
       await expect(service.login(dto)).rejects.toThrow(`Invalid credentials or account not exists`);
       expect(spyFindOneUserAccount).toHaveBeenCalled()
       expect(spyFindOneUserAccount).toHaveBeenCalledWith({"where": {"username": "username"}, "relations": ['user']})
       expect(spyBcrypt).toHaveBeenCalledTimes(0)
       expect(spySignJwt).toHaveBeenCalledTimes(0)
    })

    it('should throw exception when passwords do not match', async () => {
       const dto: LoginUserDTO = {
        username: "username",
        password: "password"
       }
       const spyFindOneUserAccount = jest.spyOn(userAccountRepository, "findOne").mockImplementation(() => Promise.resolve(mockUserAccount))
       const spyBcrypt = jest.spyOn(bcrypt, "compare").mockImplementation(() => Promise.resolve(false))
       const spySignJwt = jest.spyOn(jwtService, "sign")

       await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
       await expect(service.login(dto)).rejects.toThrow(`Invalid credentials or account not exists`);
       expect(spyFindOneUserAccount).toHaveBeenCalled()
       expect(spyFindOneUserAccount).toHaveBeenCalledWith({"where": {"username": "username"}, "relations": ['user']})
       expect(spyBcrypt).toHaveBeenCalled()
       expect(spyBcrypt).toHaveBeenCalledWith("password", "password")
       expect(spySignJwt).toHaveBeenCalledTimes(0)
    })

    it('should find user by id', async () => {
        const userId: number = 1;
        const spy = jest.spyOn(userRepository, "findOneOrFail").mockImplementation(() => Promise.resolve(mockUser))
        const result = await service.findUser(userId)

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith({"where": {"id": 1}})
        expect(result).toBe(mockUser)
    })

    it('should throw exception when user not found', async () => {
        const userId: number = 1;
        const spy = jest.spyOn(userRepository, "findOneOrFail").mockRejectedValue(new EntityNotFoundError(`Could not find any entity of type "User" matching`, {"where": {"id": 1}}))

        await expect(service.findUser(userId)).rejects.toThrow(EntityNotFoundError);
        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith({"where": {"id": 1}})
    })
})