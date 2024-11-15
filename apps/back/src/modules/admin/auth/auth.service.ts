import { Injectable } from '@nestjs/common';
import { WorkerCredentials } from './worker-credentials.entity';
import { EntityManager, LoadStrategy } from '@mikro-orm/postgresql';
import bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtTokenPayload } from './jwt-token-payload.interface';
import { Worker } from '../worker.entity';

@Injectable()
export class AdminAuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly config: ConfigService,
    private readonly jwt: JwtService,
  ) {}

  async verifyWorker(
    username: string,
    password: string,
  ): Promise<Worker | null> {
    const workerCredentials = await this.em.findOne(
      WorkerCredentials,
      {
        username,
      },
      {
        populate: ['worker', 'worker.cluster.guid'],
      },
    );

    if (!workerCredentials) {
      return null;
    }

    if (workerCredentials.isSuspended) {
      return null;
    }

    const isPasswordValid = await this.comparePassword(
      password,
      workerCredentials.passwordHash,
    );

    return isPasswordValid ? workerCredentials.worker : null;
  }

  private async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async generateWorkerTokens(worker: Worker) {
    const now = new Date();

    const accessTokenExpiration = new Date(
      now.getTime() +
        parseInt(
          this.config.getOrThrow<string>(
            'adminJwtAuth.accessTokenExpirationMs',
          ),
        ),
    );

    const refreshTokenExpiration = new Date(
      now.getTime() +
        parseInt(
          this.config.getOrThrow<string>(
            'adminJwtAuth.refreshTokenExpirationMs',
          ),
        ),
    );

    const tokenPayload: JwtTokenPayload = {
      guid: worker.guid,
      clusterGuid: worker.cluster?.guid || '',
      entity: 'worker',
    };

    const accessToken = this.jwt.sign(tokenPayload, {
      secret: this.config.getOrThrow('adminJwtAuth.accessTokenSecret'),
      expiresIn: `${this.config.getOrThrow(
        'adminJwtAuth.accessTokenExpirationMs',
      )}ms`,
    });

    const refreshToken = this.jwt.sign(tokenPayload, {
      secret: this.config.getOrThrow('adminJwtAuth.refreshTokenSecret'),
      expiresIn: `${this.config.getOrThrow(
        'adminJwtAuth.refreshTokenExpirationMs',
      )}ms`,
    });

    return {
      accessToken,
      refreshToken,
      accessTokenExpiration,
      refreshTokenExpiration,
    };
  }

  async verifyWorkersRefreshToken(workerGuid: string) {
    const worker = await this.em.findOne(
      Worker,
      { guid: workerGuid },
      {
        populate: ['credentials', 'cluster.guid'],
        strategy: LoadStrategy.JOINED,
      },
    );

    if (!worker) {
      return null;
    }

    const workerCredentials = worker.credentials;

    if (!workerCredentials) {
      return null;
    }

    const isSuspended = workerCredentials.isSuspended;

    if (isSuspended) {
      return null;
    }

    return worker;
  }
}
