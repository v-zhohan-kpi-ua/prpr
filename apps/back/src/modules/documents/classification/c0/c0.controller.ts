import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { C0Service } from './c0.service';
import { ApiTags } from '@nestjs/swagger';
import { DocumentType } from '@prpr/documents';
import { C0GetInputDto } from './dto/get.input.dto';
import { C0GetOutputDto } from './dto/get.output.dto';

@ApiTags(`documents/${DocumentType.C0_Main_Case}`)
@Controller(DocumentType.C0_Main_Case)
export class C0Controller {
  constructor(
    private readonly service: C0Service,
    private readonly getDto: C0GetOutputDto,
  ) {}

  @Get(':year/:id')
  async getByYearAndId(@Param() params: C0GetInputDto) {
    const document = await this.service.getByYearAndId(params);

    if (document) {
      return this.getDto.toDto(document);
    } else {
      throw new NotFoundException();
    }
  }
}
