import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { UnsplashClient } from "src/clients/unplash/unsplash.client";

@Processor('auth')
export class AuthProcessor extends WorkerHost {
    constructor(private unsplashClient: UnsplashClient) {
        super()
    }

    async process(job: Job): Promise<any> {
        console.log(`Processing job with ${job.id} with data ${job.data}`)
        console.log(job.data)
        console.log(await this.unsplashClient.unsplashRequest())
    }

}