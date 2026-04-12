import { Test, TestingModule } from "@nestjs/testing"
import { AuthProcessor } from "./auth.processor";
import { UnsplashClient } from "../../clients/unplash/unsplash.client";
import { AuthService } from "../auth.service";
import { Job } from "bullmq";
import { User, UserGender } from "../../users/entities/user.entity";
import { UserAccountRole } from "../../users/entities/user-account.entity";
import { UnsplashResponse } from "src/clients/unplash/unsplash.interface";
import { EntityNotFoundError } from "typeorm";

describe('AuthProcessor', () => {
    let authProcessor: AuthProcessor;
    let authService: AuthService;
    let unsplashClient: UnsplashClient

    const mockAuthService = {
        findUser: jest.fn(),
        addAvatarUrlToUser: jest.fn()
    }

    const mockUnsplashClient = {
        unsplashRequest: jest.fn()
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

    const mockUnsplashResponse: UnsplashResponse = {
        urls: {
            raw: "url_image"
        }
    } as UnsplashResponse

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthProcessor,
                {
                    provide: AuthService,
                    useValue: mockAuthService
                },
                {
                    provide: UnsplashClient,
                    useValue: mockUnsplashClient
                }
            ]
        }).compile()
        
        authProcessor = module.get<AuthProcessor>(AuthProcessor)
        authService = module.get<AuthService>(AuthService)
        unsplashClient = module.get<UnsplashClient>(UnsplashClient)
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(authProcessor).toBeDefined()
    })

    it('should process job and update user avatar successfully', async () => {
        const job = {
            data: { userId: 1 }
        } as Job;

        const spyFindUserAuthService = jest.spyOn(authService, "findUser").mockImplementation(() => Promise.resolve(mockUser))
        const spyUnsplashRequestUnsplashClient = jest.spyOn(unsplashClient, "unsplashRequest").mockImplementation(() => Promise.resolve(mockUnsplashResponse))
        const spyAddAvatarUrlToUserAuthService = jest.spyOn(authService, "addAvatarUrlToUser")

        await authProcessor.process(job)

        expect(spyFindUserAuthService).toHaveBeenCalled()
        expect(spyFindUserAuthService).toHaveBeenCalledWith(1);
        expect(spyUnsplashRequestUnsplashClient).toHaveBeenCalled();
        expect(spyAddAvatarUrlToUserAuthService).toHaveBeenCalled();
        expect(spyAddAvatarUrlToUserAuthService).toHaveBeenCalledWith(mockUser, mockUnsplashResponse.urls.raw);
    })

    it('should not update user if user does not exist', async () => {
        const job = {
            data: { userId: 999 },
        } as Job;
        
        const spyFindUserAuthService = jest.spyOn(authService, "findUser").mockRejectedValue(new EntityNotFoundError(`Could not find any entity of type "User" matching`, {"where": {"id": 999}}))
        const spyUnsplashRequestUnsplashClient = jest.spyOn(unsplashClient, "unsplashRequest")
        const spyAddAvatarUrlToUserAuthService = jest.spyOn(authService, "addAvatarUrlToUser")
        
        await authProcessor.process(job)
        
        expect(spyFindUserAuthService).toHaveBeenCalled()
        expect(spyFindUserAuthService).toHaveBeenCalledWith(999);
        expect(spyUnsplashRequestUnsplashClient).not.toHaveBeenCalled();
        expect(spyAddAvatarUrlToUserAuthService).not.toHaveBeenCalled();
    });

    it('should handle API failure gracefully', async () => {
        const job = {
            data: { userId: 1 },
        } as Job;
        
        const spyFindUserAuthService = jest.spyOn(authService, "findUser").mockImplementation(() => Promise.resolve(mockUser))
        const spyUnsplashRequestUnsplashClient = jest.spyOn(unsplashClient, "unsplashRequest").mockRejectedValue(new Error('API Rate Limit Exceeded'))
        const spyAddAvatarUrlToUserAuthService = jest.spyOn(authService, "addAvatarUrlToUser")
        
        await expect(authProcessor.process(job)).rejects.toThrow(Error);
        
        expect(spyFindUserAuthService).toHaveBeenCalled()
        expect(spyFindUserAuthService).toHaveBeenCalledWith(1);
        expect(spyUnsplashRequestUnsplashClient).toHaveBeenCalled();
        expect(spyAddAvatarUrlToUserAuthService).not.toHaveBeenCalled();
    });

    it('should handle missing avatar URL in response', async () => {
        const job = {
            data: { userId: 1 },
        } as Job;
        
        const spyFindUserAuthService = jest.spyOn(authService, "findUser").mockImplementation(() => Promise.resolve(mockUser))
        const spyUnsplashRequestUnsplashClient = jest.spyOn(unsplashClient, "unsplashRequest").mockImplementation(() => Promise.resolve({} as UnsplashResponse))
        const spyAddAvatarUrlToUserAuthService = jest.spyOn(authService, "addAvatarUrlToUser")
        
        await expect(authProcessor.process(job)).rejects.toThrow(Error);
        
        expect(spyFindUserAuthService).toHaveBeenCalled()
        expect(spyFindUserAuthService).toHaveBeenCalledWith(1);
        expect(spyUnsplashRequestUnsplashClient).toHaveBeenCalled();
        expect(spyAddAvatarUrlToUserAuthService).not.toHaveBeenCalled();
    });
})