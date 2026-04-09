import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { UnsplashClient } from "src/clients/unplash/unsplash.client";
import { AuthService } from "../auth.service";

@Processor('auth')
export class AuthProcessor extends WorkerHost {
    constructor(private unsplashClient: UnsplashClient, private authService: AuthService) {
        super()
    }

    async process(job: Job): Promise<any> {
        const user = await this.authService.findUser(job.data?.userId)
        if(!user) return

        const unsplashResponse = await this.unsplashClient.unsplashRequest()
        const avatarUrl = unsplashResponse?.urls?.raw

        // Update user
        this.authService.addAvatarUrlToUser(user, avatarUrl)
    }

}