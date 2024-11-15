import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AdminAuthService } from '../auth.service';

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(
  Strategy,
  'local-admin',
) {
  constructor(private readonly auth: AdminAuthService) {
    super({
      usernameField: 'username',
    });
  }

  async validate(username: string, password: string) {
    const worker = await this.auth.verifyWorker(username, password);

    if (worker) {
      return worker;
    }

    return false;
  }
}
