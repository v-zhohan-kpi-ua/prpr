import {
  ArrayMaxSize,
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsMimeType,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { MimeTypes } from '@prpr/mime-types';
import { Type } from 'class-transformer';

class FileInfoBase {
  @IsString()
  @IsNotEmpty()
  ref: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  sizeInBytes: number;

  @IsMimeType()
  @IsString()
  @IsNotEmpty()
  mimeType: string;
}

class IdDocFileInfo extends FileInfoBase {
  @Max(10 * 1024 * 1024)
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  sizeInBytes: number;

  @IsIn([MimeTypes['.pdf'], MimeTypes['.jpeg'], MimeTypes['.png']])
  @IsString()
  @IsNotEmpty()
  mimeType: string;
}

class PropertyIdDocFileInfo extends FileInfoBase {
  @Max(50 * 1024 * 1024)
  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  sizeInBytes: number;

  @IsIn([
    MimeTypes['.pdf'],
    MimeTypes['.jpeg'],
    MimeTypes['.png'],
    MimeTypes['.zip'],
  ])
  @IsString()
  @IsNotEmpty()
  mimeType: string;
}

class EvidenceDocFileInfo extends PropertyIdDocFileInfo {}

class PreUploadFilesInputDto {
  @ArrayMaxSize(3)
  @ArrayNotEmpty()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => IdDocFileInfo)
  id: IdDocFileInfo[];

  @ArrayMaxSize(6)
  @ArrayNotEmpty()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PropertyIdDocFileInfo)
  propertyId: PropertyIdDocFileInfo[];

  @ArrayMaxSize(6)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvidenceDocFileInfo)
  @IsOptional()
  evidenceOfDamagedProperty?: EvidenceDocFileInfo[];
}

export { PreUploadFilesInputDto, FileInfoBase };
