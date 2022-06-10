import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Diff, Monitors, Pipelines, ResourceId, SourceData, SubscriberState } from '@dialectlabs/monitor';
import { DialectConnection } from './dialect-connection';
import { fetchFeatureSet } from './version-service/version-service';
import { Duration } from 'luxon';
import { PublicKey } from '@solana/web3.js';

const pubKey = new PublicKey('CRpSadzckbDKKaRcUPeGrQmXA2M2oNSGZbTYvyLNs4vA');

export interface HashSet {
  hashes: FeatureRelease[]
  subscribers: ResourceId[]
}

export interface FeatureRelease {
  featureHash: String;
  description: String;
}

@Injectable()
export class MonitoringService implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly dialectConnection: DialectConnection) {}

  onModuleInit() {
    const monitor = Monitors.builder({
      monitorKeypair: this.dialectConnection.getKeypair(),
      dialectProgram: this.dialectConnection.getProgram(),
    })
    .defineDataSource<HashSet>()
    .poll(
      async (subscribers) => this.getFeatureSet(subscribers),
      Duration.fromObject({ seconds: 10 }),
    )
    .transform<FeatureRelease[], FeatureRelease[]>({
      keys: ['hashes'],
      pipelines: [Pipelines.added((e1, e2) => true)],
    })
    .notify()
    .dialectThread(
      (data) => {
        var updateSuffix = data.value.length > 1 ? "s" : ""
        return {
          message: `New solana update${updateSuffix} available: ${data.value.map((e) => e.description).join(', ')}`
        };
      },
      {
        dispatch: 'multicast',
        to: ({ origin }) => {
          return origin.subscribers;
        },
      },
    )
    .and()
    .build();
    monitor.start();
  }

  async onModuleDestroy() {
    await Monitors.shutdown();
  }

  private async getFeatureSet(
    subscribers: ResourceId[],
  ): Promise<SourceData<HashSet>[]> {
    const set = await fetchFeatureSet();
    const sourceData: SourceData<HashSet> = {
      groupingKey: pubKey.toBase58(),
      data: {
        subscribers: subscribers,
        hashes: set
      },
    };
    return [sourceData];
  }
}
