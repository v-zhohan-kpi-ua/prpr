import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private config: ConfigService) {}

  getHello(): string {
    const env = this.config.get<string>('node.env');

    console.log(process.env);

    return `Hello World! ${env}`;
  }
}
