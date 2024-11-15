import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from '@mikro-orm/core';
import { BaseDocument } from '@prpr/documents';
import { generateRandomHumanReadableNumber } from '@prpr/documents/number';
import { AssignedDocument } from './assignments/assigned-document.entity';
import { v7 } from 'uuid';

@Entity()
@Unique({ properties: ['type', 'year', 'id'] })
export class Document<P> implements Omit<BaseDocument<P>, 'assignments'> {
  @PrimaryKey({ type: 'uuid' })
  guid: string = v7();

  @Property({ type: 'varchar', length: 32 })
  id: string = generateRandomHumanReadableNumber();

  @Property({ type: 'varchar', length: 3 })
  type: string;

  @Property({ type: 'smallint' })
  year: number = new Date().getFullYear();

  @OneToMany(() => AssignedDocument, (assignedDoc) => assignedDoc.document)
  assignments = new Collection<AssignedDocument<P>>(this);

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property({ type: 'jsonb' })
  properties: P;
}
