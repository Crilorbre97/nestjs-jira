import { Test, TestingModule } from "@nestjs/testing"
import { AuthProducer } from "./auth.producer";
import { getQueueToken } from "@nestjs/bullmq";
import { Queue } from "bullmq";

describe('AuthProducer', () => {
    let authProducer: AuthProducer;
    let authQueue: Queue;

    const mockAuthQueue = {
        add: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthProducer,
                {
                    provide: getQueueToken('auth'),
                    useValue: mockAuthQueue
                }
            ]
        }).compile()

        authProducer = module.get<AuthProducer>(AuthProducer)
        authQueue = module.get<Queue>(getQueueToken('auth'))
    })

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(authProducer).toBeDefined();
    });

    it('should add fetch-avatar-url job to queue', async () => {
        const jobData = { userId: 123 };
        
        await authProducer.fetchAvatarUrl(jobData);

        const spyAuthQueue = jest.spyOn(authQueue, "add")
        
        expect(spyAuthQueue).toHaveBeenCalledTimes(1);
        expect(spyAuthQueue).toHaveBeenCalledWith('fecth-avatar-url', jobData);
    });

    it('should handle queue errors gracefully', async () => {
        const queueError = new Error('Queue connection failed');
        const spy = jest.spyOn(authQueue, "add").mockRejectedValue(queueError)
        
        const jobData = { userId: 123 };
        
        await expect(authProducer.fetchAvatarUrl(jobData)).rejects.toThrow('Queue connection failed');
    });
})