import {
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
  Collection,
  OneToOne,
} from '@mikro-orm/core';
import { Cluster } from './cluster.entity';
import { AssignedDocument } from '../documents/assignments/assigned-document.entity';
import { WorkerCredentials } from './auth/worker-credentials.entity';
import { v7 } from 'uuid';

@Entity()
export class Worker {
  @PrimaryKey({ type: 'uuid' })
  guid: string = v7();

  @Property({ type: 'varchar', length: 100 })
  givenName: string;

  @Property({ type: 'varchar', length: 100 })
  surname: string;

  @Property({ type: 'varchar', length: 50 })
  title: string;

  @Property({ type: 'varchar', length: 100 })
  publicEmail: string;

  @ManyToOne(() => Cluster, { nullable: true })
  cluster?: Cluster; // Nullable field since the worker can be global (not assigned to a cluster)

  @OneToMany(() => AssignedDocument, (assignedDoc) => assignedDoc.worker)
  assignedDocuments = new Collection<AssignedDocument>(this);

  @OneToOne(
    () => WorkerCredentials,
    (credentials: WorkerCredentials) => credentials.worker,
    {
      nullable: true,
      owner: true,
      orphanRemoval: true,
    },
  )
  credentials?: WorkerCredentials;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
