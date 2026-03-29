import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { RequestsInterceptor } from './common/interceptors/requests.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove properties that don't have decorators
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false
    })
  )

  app.useGlobalInterceptors(new RequestsInterceptor())

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
