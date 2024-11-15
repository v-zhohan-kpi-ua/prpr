import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { DocumentType } from '@prpr/documents';
import { F0CreateInputDto } from './dto/create.input.dto';
import { PreUploadFilesInputDto } from './dto/pre-upload-files.input.dto';
import { F0Service } from './f0.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateOutputDto } from './dto/create.output.dto';
import { F0GetInputDto } from './dto/get.input.dto';
import { F0GetOutputDto } from './dto/get.output.dto';

@ApiTags(`documents/${DocumentType.F0_Apply_To_Open_Main_Case}`)
@Controller(DocumentType.F0_Apply_To_Open_Main_Case)
export class F0Controller {
  constructor(
    private readonly service: F0Service,
    private readonly getDto: F0GetOutputDto,
  ) {}

  @Get(':year/:id')
  async getByYearAndId(@Param() params: F0GetInputDto) {
    const document = await this.service.getByYearAndId(params);

    if (document) {
      return this.getDto.toDto(document);
    } else {
      throw new NotFoundException();
    }
  }

  @Post()
  async create(@Body() input: F0CreateInputDto) {
    const document = await this.service.create(input);

    return CreateOutputDto.toDto(document);
  }

  @HttpCode(HttpStatus.OK)
  @Post('files/pre-upload')
  async preUploadFiles(@Body() input: PreUploadFilesInputDto) {
    return this.service.preUploadFiles(input);
  }
}
