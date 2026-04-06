import { Module } from "@nestjs/common";
import { UnsplashClient } from "./unplash/unsplash.client";
import { HttpClient } from "./http.client";

@Module({
    providers: [HttpClient, UnsplashClient],
    exports: [UnsplashClient]
})
export class ClientModule { }