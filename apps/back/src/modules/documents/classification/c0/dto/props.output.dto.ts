import { Injectable } from '@nestjs/common';
import { C0Properties, F0PropertiesStatus } from '@prpr/documents/properties';
import { F0PropertiesOutputDto } from '../../f0/dto/props.output.dto';

@Injectable()
export class C0PropertiesOutputDto {
  constructor(private readonly f0PropertiesDto: F0PropertiesOutputDto) {}

  toDto(
    entity: C0Properties,
    context?: {
      f0Properties?: Parameters<
        typeof F0PropertiesOutputDto.prototype.toDto
      >[1];
    },
  ) {
    const { form: f0PropertiesForm } = this.f0PropertiesDto.toDto(
      {
        status: F0PropertiesStatus.SUBMITTED, // dummy value
        form: entity.f0Form,
      },
      context?.f0Properties,
    );

    return {
      f0Form: f0PropertiesForm,
      mainLongTermAssignmentGuid: entity.mainLongTermAssignmentGuid,
      statusChange: entity.statusChange,
    };
  }
}
