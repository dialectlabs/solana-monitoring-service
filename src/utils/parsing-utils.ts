import axios from 'axios';
import { FeatureRelease } from 'src/monitoring.service';

export async function parseFeatureSDKFile(): Promise<FeatureRelease[]> {
  try {
    const req = await axios.get(
      'https://raw.githubusercontent.com/solana-labs/solana/master/sdk/src/feature_set.rs',
    );

    if (!req.data && req.data.length === 0) {
      return [];
    }
    const regx = /\(.*::id\(\),[ ?]".*\)/gm;
    const matches = req.data.match(regx);

    const finalMap = matches.map((it: any) => {
      const descRegex = /".*"/gm;

      return {
        featureHash: it.split(',')[0].replace('(', '').replace('::id()', ''),
        description: it.match(descRegex)[0].replace('"', '').replace('"', ''),
      };
    });

    return finalMap;
  } catch (e) {
    return [];
  }
}
