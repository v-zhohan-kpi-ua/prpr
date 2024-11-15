import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/core';
import { Worker } from '../worker.entity';
import { v7 } from 'uuid';

@Entity()
export class WorkerCredentials {
  @PrimaryKey({ type: 'uuid' })
  guid: string = v7();

  @Property({ type: 'varchar', length: 255, unique: true })
  username: string;

  @Property({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Property({ type: 'boolean', default: false })
  isSuspended: boolean;

  @OneToOne(() => Worker, { mappedBy: 'credentials', orphanRemoval: true })
  worker: Worker;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
