import { Injectable } from "@nestjs/common";
import { UnsplashResponse } from "./unsplash.interface";
import { HttpClient } from "../http.client";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UnsplashClient {
    constructor(private httpClient: HttpClient, private configService: ConfigService) { }

    private baseUrl(){
        return this.configService.get('unsplash.url')
    }

    private clientId(){
        return this.configService.get('unsplash.clientId')
    }

    async unsplashRequest(): Promise<UnsplashResponse>{
        return await this.httpClient.get(`${this.baseUrl()}/photos/random`, {
            headers: {
                "Authorization": `Client-ID ${this.clientId()}`
            }
        })
    }
}