import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DocumentType } from '@prpr/documents';
import { F0AssignmentsService } from 'src/modules/documents/assignments/classification/f0/f0-assignment.service';
import { JwtAdminAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentWorkerJwtPayload } from '../auth/decorators/current-worker-jwt-payload.decorator';
import { type JwtTokenPayload } from '../auth/jwt-token-payload.interface';
import { F0GetOutputDto } from 'src/modules/documents/classification/f0/dto/get.output.dto';
import { F0ApproveOrRejectAssignmentInputDto } from 'src/modules/documents/assignments/classification/f0/approve-or-reject.input.dto';

@ApiTags(`documents/${DocumentType.F0_Apply_To_Open_Main_Case}`)
@UseGuards(JwtAdminAuthGuard)
@Controller(`documents/${DocumentType.F0_Apply_To_Open_Main_Case}`)
export class F0DocumentsAdminController {
  constructor(
    private readonly f0AssignmentsService: F0AssignmentsService,
    private readonly documentDto: F0GetOutputDto,
  ) {}

  @Get('assignments/next')
  async getWorkersNextAssignment(
    @CurrentWorkerJwtPayload() authPayload: JwtTokenPayload,
  ) {
    const { assignment, count } =
      await this.f0AssignmentsService.getWorkersNextAssignmentToProcessByTheirGuid(
        authPayload.guid,
      );

    return {
      leftIncludingCurrent: count,
      assignment: assignment
        ? {
            guid: assignment.guid,
            deadline: assignment.deadline,
            status: assignment.status,
            createdAt: assignment.createdAt,
            updatedAt: assignment.updatedAt,
            document: this.documentDto.toDto(assignment.document, {
              properties: {
                howToFormat: ['with-docs-urls', 'for-inside-cluster'],
              },
            }),
          }
        : null,
    };
  }

  @Patch('assignments/:guid/approve-or-reject')
  async approveOrRejectAssignment(
    @CurrentWorkerJwtPayload() authPayload: JwtTokenPayload,
    @Body() input: F0ApproveOrRejectAssignmentInputDto,
    @Param('guid') guid: string,
  ) {
    const result = await this.f0AssignmentsService.approveOrRejectAssignment({
      guid,
      workerGuid: authPayload.guid,
      input,
    });

    if (!result) {
      throw new BadRequestException();
    }

    if (result === 'forbidden') {
      throw new ForbiddenException();
    }

    return {
      guid: result.guid,
      status: result.status,
    };
  }
}
