import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
import { AssignedDocument } from './assigned-document.entity';
import { S3Module } from 'src/modules/s3/s3.module';
import { AssignmentsService } from './assignments.service';
import { F0AssignmentsService } from './classification/f0/f0-assignment.service';
import { DocumentsModule } from '../documents.module';

@Module({
  imports: [
    MikroOrmModule.forFeature([AssignedDocument]),
    S3Module,
    forwardRef(() => DocumentsModule),
  ],
  controllers: [],
  providers: [AssignmentsService, F0AssignmentsService],
  exports: [AssignmentsService, F0AssignmentsService],
})
export class AssignmentsModule {}
