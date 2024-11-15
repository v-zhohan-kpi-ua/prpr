import { EntityManager, raw } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Worker } from 'src/modules/admin/worker.entity';

@Injectable()
export class AssignmentsService {
  constructor(private readonly em: EntityManager) {}

  async getWorkerForAssignmentInRobinFashionByLocationId({
    locationId,
  }: {
    locationId: string;
  }): Promise<Worker | null> {
    const qb = this.em.createQueryBuilder(Worker, 'w');

    qb.select('w.*')
      .leftJoin('w.cluster', 'c')
      .leftJoin('c.locations', 'cl')
      .where({ 'cl.locationId': locationId })
      .leftJoin('w.assignedDocuments', 'ad')
      .groupBy('w.guid')
      .orderBy({
        [raw('count(ad.guid)')]: 'asc',
        'w.surname': 'asc',
        'w.givenName': 'asc',
      })
      .limit(1);

    const worker = await qb.getSingleResult();

    return worker;
  }
}
