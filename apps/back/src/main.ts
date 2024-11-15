import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggerErrorInterceptor, Logger as LoggerPino } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { defaults } from './config/app.config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const logger = new Logger('BootstrapApp');
  const config = app.get(ConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Hello World')
    .setDescription('The Hello World API description')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(
    config.get<string>('swagger.url') || defaults.swagger.url,
    app,
    swaggerDocument,
  );

  app.use(helmet());
  app.enableCors({
    origin: [
      'http://127.0.0.1:3000/',
      'http://localhost:3000/',
      'http://127.0.0.1:3000',
      'http://localhost:3000',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });
  app.use(cookieParser());

  app.useLogger(app.get(LoggerPino));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableShutdownHooks();

  const PORT = config.get<string>('node.port') || defaults.node.port;
  await app.listen(PORT);

  logger.log(`Running on http://localhost:${PORT}`);
}
bootstrap();
