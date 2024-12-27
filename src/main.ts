import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';  // Asegúrate de importar esto
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { join } from 'path';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.APP_PORT || 3001;
  const expressApp = app.getHttpAdapter().getInstance();

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  expressApp.get('/', (req, res) => {
    res.render('form');
  });

  app.setGlobalPrefix('api/v1');
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
  Logger.debug(`Project created by Joaquin Centurion`);
  Logger.debug(`GitHub: https://github.com/JkDevArg`);
}

bootstrap();
