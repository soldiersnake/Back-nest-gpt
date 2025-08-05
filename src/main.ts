import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // config de las validaciones del paquete "npm install class-validator class-transformer"
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.enableCors(); //config de CORS


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
