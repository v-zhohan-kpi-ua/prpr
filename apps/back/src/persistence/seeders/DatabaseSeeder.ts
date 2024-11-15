import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Worker } from '../../modules/admin/worker.entity';
import { Cluster } from '../../modules/admin/cluster.entity';
import {
  filterByOnRaw,
  LocationType,
  findAllChildrenByParent,
} from '@prpr/locations';
import { ClusterLocation } from '../../modules/admin/cluster-location.entity';
import { WorkerCredentials } from '../../modules/admin/auth/worker-credentials.entity';
import bcrypt from 'bcrypt';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    console.time('seed');

    const voRegion = filterByOnRaw({ regions: ['vo'] });

    const communities = voRegion.filter(
      (location) => location.type === 'COMMUNITY',
    );

    // START: Seed clusters
    console.time('seed-clusters');

    const clusters: Cluster[] = [];

    const clustersWithCommunityId: { [key: string]: Cluster } = {};

    communities.forEach((community) => {
      const cluster = new Cluster();
      cluster.name = `ЦНАП ${community.name['uk']} (громада) / CNAP ${community.name['en']} (community)`;
      cluster.address = `населений пункт Рандомний, вулиця Рандомна, 0 / Random settlement, Random street, 0`;

      clustersWithCommunityId[community.id] = cluster;

      clusters.push(cluster);
    });

    await em.persistAndFlush(clusters);

    console.timeEnd('seed-clusters');
    // END: Seed clusters

    // START: Seed cluster locations relations
    console.time('seed-cluster-locations');

    const locationsToInclude: LocationType[] = [
      'CAPITAL_CITY',
      'CITY',
      'SETTLEMENT',
      'URBAN',
      'VILLAGE',
    ];

    const clusterLocationsIds = communities.reduce((acc, community) => {
      const children = findAllChildrenByParent(voRegion, community);

      const locations = children
        .filter((location) => locationsToInclude.includes(location.type))
        .map((location) => location.id);

      return { ...acc, [community.id]: locations };
    }, {}) as { [key: string]: string[] };

    const clusterLocations: ClusterLocation[] = [];

    communities.forEach((community) => {
      const id = community.id;
      const cluster = clustersWithCommunityId[id];

      clusterLocationsIds[id].forEach((locationId) => {
        const clusterLocation = new ClusterLocation();
        clusterLocation.cluster = cluster;
        clusterLocation.locationId = locationId;

        clusterLocations.push(clusterLocation);
      });
    });

    await em.persistAndFlush(clusterLocations);

    console.timeEnd('seed-cluster-locations');
    // END: Seed cluster locations relations

    // START: Seed workers
    console.time('seed-workers');

    const workers: Worker[] = [];

    const createWorker = async (cluster: Cluster) => {
      const randomWorkerSlug = Math.random().toString(16).substring(8);

      const worker = new Worker();
      worker.cluster = cluster;
      worker.surname = 'Generated Worker (Seed)';
      worker.givenName = `# ${randomWorkerSlug}`;
      worker.title = 'Worker Title (Seed)';
      worker.publicEmail = `${randomWorkerSlug}-gen-worker-seed@cnap.example.com`;

      const credentials = new WorkerCredentials();
      credentials.username = `${randomWorkerSlug}-gen-worker-seed`;
      credentials.passwordHash = await bcrypt.hash('password', 13);
      credentials.worker = worker;

      workers.push(worker);
    };

    const workerPromises = clusters.map(async (cluster) => {
      const numberOfWorkers = Math.floor(Math.random() * 3) + 3;

      const workerCreationPromises = [];
      for (let i = 0; i < numberOfWorkers; i++) {
        workerCreationPromises.push(createWorker(cluster));
      }

      await Promise.all(workerCreationPromises);
    });

    await Promise.all(workerPromises);

    await em.persistAndFlush(workers);

    console.timeEnd('seed-workers');
    // END: Seed workers

    console.timeEnd('seed');
  }
}
