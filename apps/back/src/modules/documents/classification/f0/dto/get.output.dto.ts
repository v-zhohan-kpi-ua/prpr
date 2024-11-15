import { F0Properties } from '@prpr/documents/properties';
import { Document } from 'src/modules/documents/document.entity';
import { F0PropertiesOutputDto } from './props.output.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class F0GetOutputDto {
  constructor(private readonly propertiesDto: F0PropertiesOutputDto) {}

  toDto(
    entity: Document<F0Properties>,
    context?: {
      properties?: Parameters<typeof F0PropertiesOutputDto.prototype.toDto>[1];
    },
  ) {
    const properties = this.propertiesDto.toDto(
      entity.properties,
      context?.properties,
    );

    return {
      ...entity,
      properties,
      assignments: entity.assignments.isInitialized()
        ? entity.assignments.getItems().map((assignment) => ({
            guid: assignment.guid,
            deadline: assignment.deadline,
            status: assignment.status,
            comment: assignment.comment,
            createdAt: assignment.createdAt,
            updatedAt: assignment.updatedAt,
            worker: assignment.worker
              ? {
                  title: assignment.worker?.title,
                  surname: assignment.worker?.surname,
                  givenName: assignment.worker?.givenName,
                  email: assignment.worker?.publicEmail,
                  cluster: assignment.worker.cluster
                    ? {
                        name: assignment.worker.cluster.name,
                        address: assignment.worker.cluster.address,
                      }
                    : undefined,
                }
              : undefined,
            resultedIn: assignment.resultedIn
              ? {
                  id: assignment.resultedIn.id,
                  type: assignment.resultedIn.type,
                  year: assignment.resultedIn.year,
                }
              : undefined,
          }))
        : undefined,
    };
  }
}
