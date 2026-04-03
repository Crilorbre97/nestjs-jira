import { Test, TestingModule } from "@nestjs/testing"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { CreateUserDTO } from "./dto/create-user.dto";
import { User, UserGender } from "../users/entities/user.entity";
import { UserAccountRole } from "../users/entities/user-account.entity";
import { CreateUserResponseDTO } from "./dto/create-user-response.dto";
import { LoginUserDTO } from "./dto/login-user.dto";
import { LoginUserResponseDTO } from "./dto/login-user.response.dto";

describe("AuthController", () => {
    let controller: AuthController;
    let service: AuthService;

    const mockUserCreated: CreateUserResponseDTO = {
        id: 1,
        name: "name",
        lastname: "lastname",
        email: "email@gmail.com",
        phone: "666666666",
        gender: UserGender.MALE,
        createdAt: new Date(),
        updatedAt: new Date(),
        userAccount: {
            id: 1,
            username: "username",
            role: UserAccountRole.USER,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    }

    const mockUserLogger: LoginUserResponseDTO = {
        accessToken: "token"
    }

    const mockAuthService = {
        create: jest.fn(),
        login: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService]
        })
        .overrideProvider(AuthService).useValue(mockAuthService)
        .compile()

        controller = module.get<AuthController>(AuthController)
        service = module.get<AuthService>(AuthService)
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    it("should create user", async () => {
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
        const spy = jest.spyOn(service, "create").mockImplementation(() => Promise.resolve(mockUserCreated))
        const result = await controller.create(dto)

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith(dto)
        expect(result).toBe(mockUserCreated)
    })

    it('should login user', async () => {
        const dto: LoginUserDTO = {
            username: "username",
            password: "password"
        }
        const spy = jest.spyOn(service, "login").mockImplementation(() => Promise.resolve(mockUserLogger))
        const result = await controller.login(dto)

        expect(spy).toHaveBeenCalled()
        expect(spy).toHaveBeenCalledWith(dto)
        expect(result).toBe(mockUserLogger)
    })
})
