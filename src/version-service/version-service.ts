import { RPC_URL } from '../dialect-connection';
import { FeatureRelease } from '../monitoring.service';
import { parseActiveHashes } from '../utils/parsing-utils';

import util from 'util';
import childProcess from 'child_process';

const exec = util.promisify(childProcess.exec);

export async function fetchFeatureSet(): Promise<FeatureRelease[]> {
  const { stdout } = await exec(`solana --url ${RPC_URL} feature status`);
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
