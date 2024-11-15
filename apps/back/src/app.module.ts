import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  validationOptions as validationOptionsOfEnvFile,
  validationSchemaOfEnvFile as validationSchemaEnvFile,
  loadConfig,
} from './config/app.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import MikroOrmConfig from './config/mikro-orm.config';
import { RouterModule } from '@nestjs/core';
import { DocumentsModule } from './modules/documents/documents.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadConfig],
      validationSchema: validationSchemaEnvFile,
      validationOptions: validationOptionsOfEnvFile,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        customProps: () => ({
          context: 'HTTP',
        }),
        transport:
          process.env.NODE_ENV != 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  singleLine: true,
                },
              }
            : undefined,
      },
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...MikroOrmConfig,
        debug: configService.get('node.env') !== 'production',
      }),
    }),
    DocumentsModule,
    AdminModule,
    RouterModule.register([
      {
        path: 'documents',
        module: DocumentsModule,
      },
      {
        path: 'admin',
        module: AdminModule,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
