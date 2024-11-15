import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { F0Properties, F0PropertiesStatus } from '@prpr/documents/properties';
import { Document } from '../../document.entity';
import { DocumentType } from '@prpr/documents';
import {
  FileOutputBase,
  PreUploadFilesOutputDto,
} from './dto/pre-upload-files.output.dto';
import {
  FileInfoBase,
  PreUploadFilesInputDto,
} from './dto/pre-upload-files.input.dto';
import { randomUUID } from 'crypto';
import { getExtensionFromMimeType } from '@prpr/mime-types';
import { F0CreateInputDto } from './dto/create.input.dto';
import { S3Service } from 'src/modules/s3/s3.service';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { EntityManager } from '@mikro-orm/postgresql';
import { AssignmentsService } from '../../assignments/assignments.service';
import { AssignedDocument } from '../../assignments/assigned-document.entity';
import { F0AssignmentsService } from '../../assignments/classification/f0/f0-assignment.service';
import { calculateSelfAssessment } from './utils';

// TODO: code can be separated into smaller files in the future
@Injectable()
export class F0Service {
  DOCUMENT_TYPE: string = DocumentType.F0_Apply_To_Open_Main_Case;

  constructor(
    private readonly s3Service: S3Service,
    private readonly assignmentsService: AssignmentsService,
    private readonly f0AssignmentsService: F0AssignmentsService,
    private readonly em: EntityManager,
  ) {}

  async getByYearAndId({ year, id }: { year: number; id: string }) {
    return this.em.findOne(
      Document,
      {
        type: this.DOCUMENT_TYPE,
        year: year,
        id: id,
      },
      {
        populate: [
          'assignments',
          'assignments.worker',
          'assignments.worker.cluster',
          'assignments.resultedIn.id',
          'assignments.resultedIn.type',
          'assignments.resultedIn.year',
        ],
        orderBy: {
          assignments: {
            createdAt: 'asc',
          },
        },
      },
    );
  }

  async create(input: F0CreateInputDto): Promise<Document<F0Properties>> {
    const whoWillBeAssigned =
      await this.assignmentsService.getWorkerForAssignmentInRobinFashionByLocationId(
        {
          locationId: input.property.residenceId,
        },
      );

    if (!whoWillBeAssigned) {
      throw new ConflictException(
        'Failed to find a worker to assign the document',
      );
    }

    const document = new Document<F0Properties>();
    document.type = this.DOCUMENT_TYPE;

    const movedKeys = await this.moveFilesFromTempToPermanent({
      filesTempKeys: {
        id: input.docs.id,
        propertyId: input.docs.propertyId,
        evidenceOfDamagedProperty: input.docs.evidenceOfDamagedProperty,
      },
    });

    const selfAssessmentResults = calculateSelfAssessment(input);

    const properties: F0Properties = {
      status: F0PropertiesStatus.SUBMITTED,
      form: {
        ...input,
        property: {
          ...input.property,
          selfAssessment: {
            scores: {
              physicalDamage: input.property.selfAssessment.physicalDamage,
              safety: input.property.selfAssessment.safety,
              livingConditions: input.property.selfAssessment.livingConditions,
            },
            formula: {
              result: selfAssessmentResults.result,
              resultRounded: selfAssessmentResults.resultRounded,
              howItWasCalculated: selfAssessmentResults.howItWasCalculated,
            },
            descriptionOfDamage:
              input.property.selfAssessment.descriptionOfDamage,
          },
          future: input.property.future,
        },
        docs: {
          id: movedKeys.id.map((key) => ({
            key: key,
          })),
          propertyId: movedKeys.propertyId.map((key) => ({
            key: key,
          })),
          evidenceOfDamagedProperty: movedKeys.evidenceOfDamagedProperty?.map(
            (key) => ({
              key: key,
            }),
          ),
        },
      },
    };

    document.properties = properties;

    const assignment = new AssignedDocument<F0Properties>();
    assignment.worker = whoWillBeAssigned;
    assignment.document = document;
    assignment.deadline = this.f0AssignmentsService.getDeadline();

    document.assignments.add(assignment);

    await this.em.persistAndFlush(document);

    return document;
  }

  private async moveFilesFromTempToPermanent({
    filesTempKeys,
  }: {
    filesTempKeys: {
      id: string[];
      propertyId: string[];
      evidenceOfDamagedProperty?: string[];
    };
  }) {
    const now = new Date();
    const PERMANENT_KEY = `documents/${now.getFullYear()}/${now.getMonth() + 1}`;

    const id = filesTempKeys.id.map((key) =>
      this.s3Service.copyObject({
        fromKey: key,
        toKey: `${PERMANENT_KEY}/${key.split('/').pop()}`,
        removeAfterCopyNoGuarantee: true,
      }),
    );
    const propertyId = filesTempKeys.propertyId.map((key) =>
      this.s3Service.copyObject({
        fromKey: key,
        toKey: `${PERMANENT_KEY}/${key.split('/').pop()}`,
        removeAfterCopyNoGuarantee: true,
      }),
    );
    const evidenceOfDamagedProperty =
      filesTempKeys.evidenceOfDamagedProperty?.map((key) =>
        this.s3Service.copyObject({
          fromKey: key,
          toKey: `${PERMANENT_KEY}/${key.split('/').pop()}`,
          removeAfterCopyNoGuarantee: true,
        }),
      );

    const idResults = await Promise.all(id);
    const propertyIdResults = await Promise.all(propertyId);
    const evidenceOfDamagedPropertyResults = await Promise.all(
      evidenceOfDamagedProperty || [],
    );

    const idKeysMoved = filesTempKeys.id
      .filter((_, index) => idResults[index])
      .map((key) => `${PERMANENT_KEY}/${key.split('/').pop()}`);
    const propertyIdKeysMoved = filesTempKeys.propertyId
      .filter((_, index) => propertyIdResults[index])
      .map((key) => `${PERMANENT_KEY}/${key.split('/').pop()}`);
    const evidenceOfDamagedPropertyKeysMoved =
      filesTempKeys.evidenceOfDamagedProperty
        ?.filter((_, index) => evidenceOfDamagedPropertyResults[index])
        .map((key) => `${PERMANENT_KEY}/${key.split('/').pop()}`);

    return {
      id: idKeysMoved,
      propertyId: propertyIdKeysMoved,
      evidenceOfDamagedProperty: evidenceOfDamagedPropertyKeysMoved,
    };
  }

  async preUploadFiles(
    input: PreUploadFilesInputDto,
  ): Promise<PreUploadFilesOutputDto> {
    const id = input.id.map((fileInfo) =>
      this.preUploadFilesGenerateFileOutput(fileInfo),
    );
    const property = input.propertyId.map((fileInfo) =>
      this.preUploadFilesGenerateFileOutput(fileInfo),
    );
    const evidenceOfDamagedProperty = input.evidenceOfDamagedProperty?.map(
      (fileInfo) => this.preUploadFilesGenerateFileOutput(fileInfo),
    );

    return {
      id: await Promise.all(id),
      propertyId: await Promise.all(property),
      evidenceOfDamagedProperty: await Promise.all(
        evidenceOfDamagedProperty || [],
      ),
    };
  }

  private async preUploadFilesGenerateFileOutput(
    fileInfo: FileInfoBase,
  ): Promise<FileOutputBase> {
    const PARENT_KEY = 'temp/documents/f0';

    const FILE_NAME = randomUUID().replace(/-/g, '');
    const FILE_EXT = getExtensionFromMimeType(fileInfo.mimeType);

    if (!FILE_EXT) {
      throw new BadRequestException(
        `File extension not found (name: ${fileInfo.name}, mimeType: ${fileInfo.mimeType}, ref: ${fileInfo.ref})`,
      );
    }

    const FILE_KEY = `${FILE_NAME}.${FILE_EXT}`;

    const FULL_KEY = `${PARENT_KEY}/${FILE_KEY}`;

    const { url, fields } = await createPresignedPost(this.s3Service.client, {
      Bucket: this.s3Service.bucketName,
      Key: FULL_KEY,
      Conditions: [
        ['content-length-range', 0, fileInfo.sizeInBytes],
        ['starts-with', '$Content-Type', fileInfo.mimeType],
      ],
      Expires: 5 * 60,
      Fields: {
        'x-amz-meta-original-filename': fileInfo.name,
      },
    });

    return {
      ref: fileInfo.ref,
      url: url,
      fields: fields,
    };
  }
}
