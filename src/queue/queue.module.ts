import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Module({
    imports: [
        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                connection: {
                    host: config.get('queueus.host'),
                    port: config.get('queueus.port'),
                    password: config.get('queueus.password')
                }
            })
        })
    ],
    exports: [BullModule]
})
export class QueueModule {}