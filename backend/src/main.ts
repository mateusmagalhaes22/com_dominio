import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuração do CORS
  const corsOrigins = process.env.CORS_ORIGINS 
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3000'];

  console.log('CORS_ORIGINS env:', process.env.CORS_ORIGINS);

  app.enableCors({
    origin: //corsOrigins
      true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Status', 'Idempotency-Key'],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 8080);
}

bootstrap();
