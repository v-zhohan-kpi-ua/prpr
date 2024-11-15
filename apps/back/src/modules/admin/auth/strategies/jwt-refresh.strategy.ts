import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AdminAuthService } from '../auth.service';
import { JwtTokenPayload } from '../jwt-token-payload.interface';

@Injectable()
export class JwtRefreshAdminStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-admin',
) {
  constructor(
    config: ConfigService,
    private readonly auth: AdminAuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) =>
          request.cookies?.[JwtRefreshAdminStrategyCookieName],
      ]),
      secretOrKey: config.getOrThrow('adminJwtAuth.refreshTokenSecret'),
    });
  }

  async validate(payload: JwtTokenPayload) {
    const workerWithCanRefresh = await this.auth.verifyWorkersRefreshToken(
      payload.guid,
    );

    if (workerWithCanRefresh) {
      return workerWithCanRefresh;
    }

    return false;
  }
}

export const JwtRefreshAdminStrategyCookieName = 'AdminAuthJwtRefreshToken';
