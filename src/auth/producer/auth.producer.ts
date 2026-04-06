import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";

@Injectable()
export class AuthProducer {
    constructor(@InjectQueue('auth') private authQueue: Queue) {}

    async fetchAvatarUrl(data){
        await this.authQueue.add('fecth-avatar-url', data)
    }
}