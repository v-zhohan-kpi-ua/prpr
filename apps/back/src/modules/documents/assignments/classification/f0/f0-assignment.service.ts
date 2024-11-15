import { EntityManager, FilterQuery } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { AssignedDocument } from '../../assigned-document.entity';
import { F0ApproveOrRejectAssignmentInputDto } from './approve-or-reject.input.dto';
import { F0Properties, F0PropertiesStatus } from '@prpr/documents/properties';
import { C0Service } from 'src/modules/documents/classification/c0/c0.service';
import { AssignmentForDocumentStatus, DocumentType } from '@prpr/documents';

@Injectable()
export class F0AssignmentsService {
  DOCUMENT_TYPE = DocumentType.F0_Apply_To_Open_Main_Case;

  constructor(
    private readonly em: EntityManager,
    private readonly c0Service: C0Service,
  ) {}

  getDeadline() {
    const now = new Date();
    const deadline = new Date(now);
    deadline.setDate(now.getDate() + 31);
    deadline.setHours(23, 59, 59, 999);

    return deadline;
  }

  async getWorkersNextAssignmentToProcessByTheirGuid(workerGuid: string) {
    const query: FilterQuery<AssignedDocument> = {
      worker: { guid: workerGuid },
      status: AssignmentForDocumentStatus.PROCESSING,
      document: { type: this.DOCUMENT_TYPE },
    };

    const [assignment, count] = await Promise.all([
      this.em.findOne(
        AssignedDocument,
        {
          ...query,
        },
        {
          populate: ['document'],
          orderBy: { createdAt: 'asc' },
        },
      ),
      this.em.count(AssignedDocument, { ...query }),
    ]);

    return { assignment, count };
  }

  async approveOrRejectAssignment({
    guid,
    workerGuid,
    input,
  }: {
    guid: string;
    workerGuid: string;
    input: F0ApproveOrRejectAssignmentInputDto;
  }) {
    const assignment = await this.em.findOne(
      AssignedDocument,
      {
        guid,
        document: { type: this.DOCUMENT_TYPE },
      },
      {
        populate: ['document', 'worker.guid'],
      },
    );

    if (!assignment) {
      return null;
    }

    if (assignment.worker.guid !== workerGuid) {
      return 'forbidden';
    }

    if (assignment.status !== AssignmentForDocumentStatus.PROCESSING) {
      return null;
    }

    assignment.status =
      input.status === 'approve'
        ? AssignmentForDocumentStatus.RESOLVED
        : AssignmentForDocumentStatus.REJECTED;

    assignment.comment = input.comment;

    const f0Properties = assignment.document.properties as F0Properties;

    f0Properties.form.docs.id = f0Properties.form.docs.id.map((doc) => ({
      ...doc,
      description: input.keysWithDescription.find(
        (keyWithDescription) => keyWithDescription.key === doc.key,
      )?.description,
    }));

    f0Properties.form.docs.propertyId = f0Properties.form.docs.propertyId.map(
      (doc) => ({
        ...doc,
        description: input.keysWithDescription.find(
          (keyWithDescription) => keyWithDescription.key === doc.key,
        )?.description,
      }),
    );

    f0Properties.form.docs.evidenceOfDamagedProperty = (
      f0Properties.form.docs?.evidenceOfDamagedProperty || []
    ).map((doc) => ({
      ...doc,
      description: input.keysWithDescription.find(
        (keyWithDescription) => keyWithDescription.key === doc.key,
      )?.description,
    }));

    if (assignment.status === AssignmentForDocumentStatus.RESOLVED) {
      f0Properties.status = F0PropertiesStatus.APPROVED;
    }

    if (assignment.status === AssignmentForDocumentStatus.REJECTED) {
      f0Properties.status = F0PropertiesStatus.REJECTED;
    }

    assignment.document.properties = f0Properties;

    if (assignment.status === AssignmentForDocumentStatus.RESOLVED) {
      const c0Document = await this.c0Service.createFromF0Assignment({
        f0Assignment: assignment,
        isPersistAndFlush: false,
      });

      assignment.resultedIn = c0Document;

      await this.em.persistAndFlush([assignment, c0Document]);
    }

    if (assignment.status === AssignmentForDocumentStatus.REJECTED) {
      await this.em.persistAndFlush(assignment);
    }

    return assignment;
  }
}
