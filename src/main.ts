import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { envs } from './config';

const options: SecuritySchemeObject = {
  name: 'Authorization',
  description: 'Enter token',
  type: 'http',
  in: 'Header',
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Coordinadora RESTFul API')
    .setDescription('Coordinadora endpoints')
    .setVersion('1.0')
    .addBearerAuth(options, 'TOKEN')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(envs.port);
  logger.log(`App running on port ${envs.port}`);
}
bootstrap();
