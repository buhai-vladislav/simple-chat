import { NestFactory, Reflector } from '@nestjs/core';
import { ApplicationModule } from './modules/Application';
import { Logger, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './guards/JwtGuard';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  const logger = new Logger(ApplicationModule.name);
  const reflector = app.get(Reflector);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.enableCors({
    origin: '*',
  });

  logger.log(`Server started on port ${ApplicationModule.port}`);
  await app.listen(ApplicationModule.port);
}
bootstrap();
