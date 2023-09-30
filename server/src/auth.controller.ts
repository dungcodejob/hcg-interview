import { HttpService } from '@nestjs/axios';
import { Controller, Get, Param, Post } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { map } from 'rxjs';
import { AppService } from './app.service';
@Controller('auth')
export class AuthController {
  clientId = this.configService.get<string>('CLIENT_ID');
  clientSecret = this.configService.get<string>('CLIENT_SECRET');
  constructor(
    private readonly appService: AppService,
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  @Post('token/:code')
  getToken(@Param('code') code: string) {
    return this.httpService
      .post(
        `https://github.com/login/oauth/access_token?client_id=${this.clientId}&client_secret=${this.clientSecret}&code=${code}`,
        null,
        { headers: { Accept: 'application/json' } },
      )
      .pipe(map((res) => res.data));
  }

  @Get('identity-url')
  getIdentityUrl() {
    return {
      url: `https://github.com/login/oauth/authorize?client_id=${this.clientId}&client_secret=${this.clientSecret}`,
    };
  }
}
