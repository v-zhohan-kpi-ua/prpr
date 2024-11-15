import { Injectable } from '@nestjs/common';
import { AssignedDocument } from '../../assignments/assigned-document.entity';
import {
  F0Properties,
  C0Properties,
  C0PropertiesStatus,
} from '@prpr/documents/properties';
import { Document } from '../../document.entity';
import { DocumentType } from '@prpr/documents';
import { EntityManager } from '@mikro-orm/postgresql';

@Injectable()
export class C0Service {
  DOCUMENT_TYPE: string = DocumentType.C0_Main_Case;

  constructor(private readonly em: EntityManager) {}

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

  async createFromF0Assignment({
    f0Assignment,
    isPersistAndFlush = true,
  }: {
    f0Assignment: AssignedDocument<F0Properties>;
    isPersistAndFlush?: boolean;
  }) {
    const c0Document = new Document<C0Properties>();
    c0Document.type = this.DOCUMENT_TYPE;
    c0Document.year = f0Assignment.document.year;
    c0Document.id = f0Assignment.document.id;

    const c0Assignment = new AssignedDocument<C0Properties>();
    c0Assignment.document = c0Document;
    c0Assignment.worker = f0Assignment.worker;

    c0Document.properties = {
      statusChange: [
        {
          status: C0PropertiesStatus.OPENED,
          changedAt: new Date(),
        },
      ],
      f0Form: f0Assignment.document.properties.form,
      mainLongTermAssignmentGuid: c0Assignment.guid,
    };

    c0Document.assignments.add(c0Assignment);

    if (isPersistAndFlush) {
      await this.em.persistAndFlush(c0Document);
    }

    return c0Document;
  }
}
