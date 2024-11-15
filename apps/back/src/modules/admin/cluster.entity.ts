import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Unique,
  Collection,
} from '@mikro-orm/core';
import { Worker } from './worker.entity';
import { ClusterLocation } from './cluster-location.entity';
import { v7 } from 'uuid';

@Entity()
@Unique({ properties: ['name', 'address'] })
export class Cluster {
  @PrimaryKey({ type: 'uuid' })
  guid: string = v7();

  @Property({ type: 'varchar', length: 100 })
  name: string;

  @Property({ type: 'varchar', length: 255 })
  address: string;

  @OneToMany(
    () => ClusterLocation,
    (clusterLocation) => clusterLocation.cluster,
  )
  locations = new Collection<ClusterLocation>(this);

  @OneToMany(() => Worker, (worker) => worker.cluster)
  workers = new Collection<Worker>(this);

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
