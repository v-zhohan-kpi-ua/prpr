import { forwardRef, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Document } from './document.entity';
import { F0Controller } from './classification/f0/f0.controller';
import { F0Service } from './classification/f0/f0.service';
import { S3Module } from '../s3/s3.module';
import { AssignmentsModule } from './assignments/assignments.module';
import { F0GetOutputDto } from './classification/f0/dto/get.output.dto';
import { F0PropertiesOutputDto } from './classification/f0/dto/props.output.dto';
import { C0Service } from './classification/c0/c0.service';
import { C0Controller } from './classification/c0/c0.controller';
import { C0GetOutputDto } from './classification/c0/dto/get.output.dto';
import { C0PropertiesOutputDto } from './classification/c0/dto/props.output.dto';

const f0OutputDtos = [F0GetOutputDto, F0PropertiesOutputDto];
const c0OutputDtos = [C0GetOutputDto, C0PropertiesOutputDto];

@Module({
  imports: [
    MikroOrmModule.forFeature([Document]),
    S3Module,
    forwardRef(() => AssignmentsModule),
  ],
  controllers: [F0Controller, C0Controller],
  providers: [F0Service, C0Service, ...f0OutputDtos, ...c0OutputDtos],
  exports: [F0Service, C0Service, ...f0OutputDtos, ...c0OutputDtos],
})
export class DocumentsModule {}
