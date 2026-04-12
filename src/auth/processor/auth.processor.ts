import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { UnsplashClient } from "../../clients/unplash/unsplash.client";
import { AuthService } from "../auth.service";

@Processor('auth')
export class AuthProcessor extends WorkerHost {
    constructor(private unsplashClient: UnsplashClient, private authService: AuthService) {
        super()
    }

    async process(job: Job): Promise<any> {
        const { userId } = job.data;
        try {
            const user = await this.authService.findUser(userId)
            if(!user) {
                console.log(`User ${userId} not found, skipping job`);
                return;
            }
    
            const unsplashResponse = await this.unsplashClient.unsplashRequest()
            const avatarUrl = unsplashResponse?.urls?.raw
            if(!avatarUrl) {
                console.log(`No avatar URL received for user ${userId}`);
                throw new Error('No avatar URL in Unsplash response');
            }
    
            // Update user
            await this.authService.addAvatarUrlToUser(user, avatarUrl)
            console.log(`Avatar updated for user ${userId}: ${avatarUrl}`);
        } catch (error) {
            if (this.shouldRetry(error, job)) {
                throw error;
            }
            console.error(`Non-retryable error processing job for user ${job.data.userId}:`, error.message);
            return
        }
    }

    private shouldRetry(error: Error, job: Job): boolean {
        const nonRetryableErrors = [
            'EntityNotFoundError'
        ]

        if (nonRetryableErrors.some(type => error.name === type)) {
            return false;
        }

        return true
    }

}