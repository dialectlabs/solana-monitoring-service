import {FeatureRelease} from 'src/monitoring.service';
import {parseActiveHashes} from 'src/utils/parsing-utils';
import {RPC_URL} from "../dialect-connection";

const util = require('util');
const exec = util.promisify(require('child_process').exec);

export async function fetchFeatureSet(): Promise<FeatureRelease[]> {
  const {stdout} = await exec(`solana --url ${RPC_URL} feature status`);
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
