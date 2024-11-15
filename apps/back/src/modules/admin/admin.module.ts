import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Cluster } from './cluster.entity';
import { ClusterLocation } from './cluster-location.entity';
import { AdminAuthService } from './auth/auth.service';
import { LocalAdminStrategy } from './auth/strategies/local.strategy';
import { JwtAdminStrategy } from './auth/strategies/jwt.strategy';
import { JwtRefreshAdminStrategy } from './auth/strategies/jwt-refresh.strategy';
import { WorkerCredentials } from './auth/worker-credentials.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Worker } from './worker.entity';
import { AdminAuthController } from './auth/auth.controller';
import { F0DocumentsAdminController } from './documents.controllers/f0-admin.controller';
import { AssignmentsModule } from '../documents/assignments/assignments.module';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Cluster,
      Worker,
      ClusterLocation,
      WorkerCredentials,
    ]),
    PassportModule,
    JwtModule,
    DocumentsModule,
    AssignmentsModule,
  ],
  controllers: [AdminAuthController, F0DocumentsAdminController],
  providers: [
    AdminAuthService,
    LocalAdminStrategy,
    JwtAdminStrategy,
    JwtRefreshAdminStrategy,
  ],
})
export class AdminModule {}
