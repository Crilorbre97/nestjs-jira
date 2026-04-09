import { InjectQueue } from "@nestjs/bullmq";
import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { AuthProducerI } from "../interfaces/auth-producer.interface";

@Injectable()
export class AuthProducer {
    constructor(@InjectQueue('auth') private authQueue: Queue) {}

    async fetchAvatarUrl(data: AuthProducerI){
        await this.authQueue.add('fecth-avatar-url', data)
    }
}