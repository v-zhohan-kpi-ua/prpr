import { Entity, ManyToOne, Property, PrimaryKey } from '@mikro-orm/core';
import { Cluster } from './cluster.entity';
import { v7 } from 'uuid';

@Entity()
export class ClusterLocation {
  @PrimaryKey({ type: 'uuid' })
  guid: string = v7();

  @ManyToOne(() => Cluster)
  cluster: Cluster;

  @Property({ type: 'varchar', length: 50 })
  locationId: string;
}
