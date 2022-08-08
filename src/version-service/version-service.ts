import { FeatureRelease } from '../monitoring.service';
import { parseActiveHashes } from '../utils/parsing-utils';
import { exec as process_exec } from 'child_process';
import { promisify } from 'util';

const exec = promisify(process_exec);

export async function fetchFeatureSet(): Promise<FeatureRelease[]> {
  const { stdout } = await exec(
    `solana --url ${
      process.env.SOLANA_RPC_URL ?? process.env.DIALECT_SDK_SOLANA_RPC_URL
    } feature status`,
  );
  if (process.env.TEST) {
    const hashes = parseActiveHashes(stdout);
    const spliced = hashes.splice(
      0,
      Math.round(Math.random() * Math.max(0, 5)),
    );
    return spliced;
  }
  return parseActiveHashes(stdout);
}
