import { F0Properties } from '@prpr/documents/properties';
import { Document } from 'src/modules/documents/document.entity';

export class CreateOutputDto {
  static toDto(entity: Document<F0Properties>) {
    return {
      guid: entity.guid,
      id: entity.id,
      type: entity.type,
      year: entity.year,
      createdAt: entity.createdAt,
      assignments: entity.assignments.getItems().map((assignment) => ({
        guid: assignment.guid,
        deadline: assignment.deadline,
        status: assignment.status,
        createdAt: assignment.createdAt,
        worker: {
          title: assignment.worker.title,
          surname: assignment.worker.surname,
          givenName: assignment.worker.givenName,
          email: assignment.worker.publicEmail,
        },
      })),
    };
  }
}
