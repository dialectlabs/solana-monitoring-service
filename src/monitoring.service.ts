import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  Monitors,
  Pipelines,
  ResourceId,
  SourceData,
} from '@dialectlabs/monitor';
import { DialectConnection } from './dialect-connection';
import { fetchFeatureSet } from './version-service/version-service';
import { Duration } from 'luxon';
import { PublicKey } from '@solana/web3.js';

const pubKey = new PublicKey('CRpSadzckbDKKaRcUPeGrQmXA2M2oNSGZbTYvyLNs4vA');

export interface HashSet {
  hashes: FeatureRelease[];
  subscribers: ResourceId[];
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
      web2SubscriberRepositoryUrl: process.env.WEB2_SUBSCRIBER_SERVICE_BASE_URL,
      sinks: {
        sms: {
          twilioUsername: process.env.TWILIO_ACCOUNT_SID!,
          twilioPassword: process.env.TWILIO_AUTH_TOKEN!,
          senderSmsNumber: process.env.TWILIO_SMS_SENDER!,
        },
        telegram: {
          telegramBotToken: process.env.TELEGRAM_TOKEN!,
        },
        email: {
          apiToken: process.env.SENDGRID_KEY!,
          senderEmail: process.env.SENDGRID_EMAIL!,
        },
      },
    })
      .defineDataSource<HashSet>()
      .poll(
        async (subscribers) => this.getFeatureSet(subscribers),
        // 2 - 3 time per day
        Duration.fromObject({ seconds: 10 }),
      )
      .transform<FeatureRelease[], FeatureRelease[]>({
        keys: ['hashes'],
        pipelines: [
          Pipelines.added((e1, e2) => e1.featureHash === e2.featureHash),
        ],
      })
      .notify()
      .dialectThread(
        (data) => {
          const publicKey = data.context.subscribers[0];
          if (publicKey) {
            console.log(publicKey.toBase58());
          }
          const updateSuffix = data.value.length > 1 ? 's' : '';
          return {
            message: `⚠️ New solana update${updateSuffix} available: ${data.value
              .map((e) => e.description)
              .join(', ')}`,
          };
        },
        {
          dispatch: 'multicast',
          to: ({ origin }) => {
            return origin.subscribers;
          },
        },
      )
      .telegram(
        (data) => {
          var updateSuffix = data.value.length > 1 ? 's' : '';
          const message: string = `⚠️ New solana update${updateSuffix} available: ${data.value
            .map((e) => e.description)
            .join(', ')}`;
          return {
            body: message,
          };
        },
        { dispatch: 'multicast', to: ({ origin }) => origin.subscribers },
      )
      .sms(
        (data) => {
          var updateSuffix = data.value.length > 1 ? 's' : '';
          const message: string = `⚠️ New solana update${updateSuffix} available: ${data.value
            .map((e) => e.description)
            .join(', ')}`;
          return {
            body: message,
          };
        },
        { dispatch: 'multicast', to: ({ origin }) => origin.subscribers },
      )
      .email(
        (data) => {
          var updateSuffix = data.value.length > 1 ? 's' : '';
          const message: string = `⚠️ New solana update${updateSuffix} available: ${data.value
            .map((e) => e.description)
            .join(', ')}`;
          return {
            subject: '⚠️ New solana update',
            text: message,
          };
        },
        { dispatch: 'multicast', to: ({ origin }) => origin.subscribers },
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
    //console.log(set);
    const sourceData: SourceData<HashSet> = {
      groupingKey: pubKey.toBase58(),
      data: {
        subscribers: subscribers,
        hashes: process.env.TEST_MODE
          ? set.slice(0, Math.round(Math.random() * Math.max(0, 2)))
          : set,
      },
    };
    return [sourceData];
  }
}
