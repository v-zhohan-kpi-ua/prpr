import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdminAuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { LocalAdminAuthGuard } from './guards/local.guard';
import { CurrentWorker } from './decorators/current-worker.decorator';
import { Worker } from '../worker.entity';
import { type Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshAdminStrategyCookieName } from './strategies/jwt-refresh.strategy';
import { JwtAdminAuthGuard } from './guards/jwt.guard';
import { JwtRefreshAdminAuthGuard } from './guards/jwt-refresh.guard';

@ApiTags('admin/auth')
@Controller('auth')
export class AdminAuthController {
  constructor(
    private readonly auth: AdminAuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('login')
  @UseGuards(LocalAdminAuthGuard)
  async login(
    @CurrentWorker() worker: Worker,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.auth.generateWorkerTokens(worker);

    this.setRefreshTokenCookie(
      res,
      tokens.refreshToken,
      tokens.refreshTokenExpiration,
    );

    return {
      token: tokens.accessToken,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAdminAuthGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(JwtRefreshAdminStrategyCookieName);
  }

  @Post('refresh')
  @UseGuards(JwtRefreshAdminAuthGuard)
  async refresh(
    @Res({ passthrough: true }) res: Response,
    @CurrentWorker() worker: Worker,
  ) {
    const tokens = await this.auth.generateWorkerTokens(worker);

    this.setRefreshTokenCookie(
      res,
      tokens.refreshToken,
      tokens.refreshTokenExpiration,
    );

    return {
      token: tokens.accessToken,
    };
  }

  private setRefreshTokenCookie(res: Response, token: string, expire: Date) {
    res.cookie(JwtRefreshAdminStrategyCookieName, token, {
      httpOnly: true,
      secure: this.config.getOrThrow<string>('node.env') === 'production',
      expires: expire,
    });
  }
}
