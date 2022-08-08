import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  Monitors,
  Pipelines,
  ResourceId,
  SourceData,
} from '@dialectlabs/monitor';
import { fetchFeatureSet } from './version-service/version-service';
import { Duration } from 'luxon';
import { PublicKey } from '@solana/web3.js';
import { DialectSdk } from './dialect-sdk';

const pubKey = new PublicKey('CRpSadzckbDKKaRcUPeGrQmXA2M2oNSGZbTYvyLNs4vA');

export interface HashSet {
  hashes: FeatureRelease[];
  subscribers: ResourceId[];
}

export interface FeatureRelease {
  featureHash: string;
  description: string;
}

@Injectable()
export class MonitoringService implements OnModuleInit {
  constructor(private readonly sdk: DialectSdk) {}

  private readonly logger = new Logger(MonitoringService.name);

  onModuleInit() {
    const monitor = Monitors.builder({
      sdk: this.sdk,
      subscribersCacheTTL: Duration.fromObject({ minute: 5 }),
    })
      .defineDataSource<HashSet>()
      .poll(async (subscribers) => {
        const featureSet = await this.getFeatureSet(subscribers);
        const hashes = featureSet.data.hashes;
        this.logger.log(
          `Found ${hashes.length} features: [${hashes.map(
            (it) => it.description,
          )}]`,
        );
        return [featureSet];
      }, Duration.fromObject({ hours: 3 }))
      .transform<FeatureRelease[], FeatureRelease[]>({
        keys: ['hashes'],
        pipelines: [
          Pipelines.added((e1, e2) => e1.featureHash === e2.featureHash),
        ],
      })
      .notify()
      .dialectSdk(
        (data) => {
          const updateSuffix = data.value.length > 1 ? 's' : '';
          return {
            title: '⚠️ New solana update',
            message: `Update${updateSuffix} available: ${data.value
              .map((e) => e.description)
              .join(', ')}`,
          };
        },
        {
          dispatch: 'broadcast',
        },
      )
      .and()
      .build();
    monitor.start();
  }

  private async getFeatureSet(
    subscribers: ResourceId[],
  ): Promise<SourceData<HashSet>> {
    const set = await fetchFeatureSet();
    return {
      groupingKey: pubKey.toBase58(),
      data: {
        subscribers: subscribers,
        hashes: process.env.TEST_MODE
          ? set.slice(0, Math.round(Math.random() * Math.max(0, 2)))
          : set,
      },
    };
  }
}
