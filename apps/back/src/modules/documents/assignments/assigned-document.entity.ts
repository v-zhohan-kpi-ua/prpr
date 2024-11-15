import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  Unique,
  Enum,
  OneToOne,
} from '@mikro-orm/core';
import { Worker } from '../../admin/worker.entity';
import { Document } from '../document.entity';
import { v7 } from 'uuid';
import { AssignmentForDocumentStatus } from '@prpr/documents';

@Entity()
@Unique({ properties: ['document', 'worker'] })
export class AssignedDocument<P = any> {
  @PrimaryKey({ type: 'uuid' })
  guid: string = v7();

  @ManyToOne(() => Document)
  document: Document<P>;

  @ManyToOne(() => Worker)
  worker: Worker;

  @Property({ type: 'date', nullable: true })
  deadline?: Date;

  @Enum(() => AssignmentForDocumentStatus)
  status: AssignmentForDocumentStatus = AssignmentForDocumentStatus.PROCESSING;

  @Property({ type: 'varchar', length: 256, nullable: true })
  comment?: string;

  @OneToOne(() => Document, { nullable: true })
  resultedIn?: Document<unknown>;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
