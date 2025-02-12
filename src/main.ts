import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config'; 
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Auth Microservice-Main');
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(envs.port);
  logger.log(`Server running on port ${envs.port}`);
  //await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
