import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.CORS_ALLOWED_ORIGINS?.split(',') ?? ['http://localhost:4200'],
    allowedHeaders: ['Content-Type'],
  });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
