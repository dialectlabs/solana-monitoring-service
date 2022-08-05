import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';

@Module({
  imports: [],
  controllers: [],
  providers: [MonitoringService],
})
export class MonitoringServiceModule {}
