import {
  IsString,
  IsIn,
  ValidateNested,
  IsArray,
  IsNotEmpty,
  ArrayNotEmpty,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

class KeyWithDescription {
  @IsString()
  @IsNotEmpty()
  @Matches(/^documents\/.*/)
  key: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class F0ApproveOrRejectAssignmentInputDto {
  @ValidateIf((o) => o.status === 'reject')
  @IsString()
  @IsNotEmpty()
  comment?: string;

  @IsIn(['approve', 'reject'])
  @IsNotEmpty()
  status: 'approve' | 'reject';

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => KeyWithDescription)
  keysWithDescription: KeyWithDescription[];
}
