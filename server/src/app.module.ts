import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { HttpModule } from '@nestjs/axios';
import { AppService } from './app.service';
import { AuthController } from './auth.controller';
@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [AuthController],
  providers: [AppService],
})
export class AppModule {}
