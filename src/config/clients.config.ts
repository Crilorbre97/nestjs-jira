import { registerAs } from "@nestjs/config";

export default () => ({
    unsplash: {
        url: process.env.UNSPLASH_URL,
        clientId: process.env.UNSPLASH_CLIENT_ID
    }
})