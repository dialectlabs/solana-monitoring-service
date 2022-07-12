import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { DialectConnection } from './dialect-connection';

@Module({
  imports: [],
  controllers: [],
  providers: [MonitoringService],
})
export class MonitoringServiceModule {}
