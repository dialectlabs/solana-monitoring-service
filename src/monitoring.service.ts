import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  Monitors,
  Pipelines,
  ResourceId,
  SourceData,
} from '@dialectlabs/monitor';
import { DialectConnection } from './dialect-connection';
import { Duration } from 'luxon';
import { fetchCurrentVersion } from './version-service/version-service';
import { PublicKey } from '@solana/web3.js';

interface Version {
  version: string;
  subscribers: PublicKey[];
}

const groupingPK = new PublicKey(
  '54MVx92iDeTmjcPxYkVUKSVE5iyd7KiPBAH4232A6tDP',
);

@Injectable()
export class MonitoringService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly dialectConnection: DialectConnection) {}

  onModuleInit() {
    const monitor = Monitors.builder({
      monitorKeypair: this.dialectConnection.getKeypair(),
      dialectProgram: this.dialectConnection.getProgram(),
    })
      .defineDataSource<Version>()
      .poll(
        async (subscribers) => this.getLatestVerion(subscribers),
        Duration.fromObject({ second: 10 }),
      )
      .transform<string, string>({
        keys: ['version'],
        pipelines: Pipelines.createNew(),
      })
      .notify()
      .dialectThread(
        ({ value }) => ({
          message: `Say hello to the future of web3 messaging.`,
        }),
        { dispatch: 'multicast', to: ({ origin }) => origin.subscribers },
      )
      .and()
      .build();
    monitor.start();
  }

  async getLatestVerion(
    subscribers: ResourceId[],
  ): Promise<SourceData<Version>[]> {
    const version = (await fetchCurrentVersion()) || '';
    return [
      {
        groupingKey: groupingPK.toBase58(),
        data: {
          version: version,
          subscribers: subscribers,
        },
      },
    ];
  }

  async onModuleDestroy() {
    await Monitors.shutdown();
  }
}
