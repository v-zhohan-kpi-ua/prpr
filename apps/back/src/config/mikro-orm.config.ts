import { Options } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

const MikroOrmConfig: Options = {
  dbName: configService.get('MIKRO_ORM_DB_NAME'),
  user: configService.get('MIKRO_ORM_USER'),
  password: configService.get('MIKRO_ORM_PASSWORD'),
  host: configService.get('MIKRO_ORM_HOST'),
  port: configService.get('MIKRO_ORM_PORT'),
  driver: PostgreSqlDriver,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  extensions: [Migrator, SeedManager],
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: 'src/persistence/migrations',
  },
  seeder: {
    path: 'src/persistence/seeders',
    pathTs: undefined,
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
    fileName: (className: string) => className,
  },
};

export default MikroOrmConfig;
