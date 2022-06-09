import { parseVersions } from "../utils/parsing-utils";
const util = require('util');
const exec = util.promisify(require('child_process').exec);

export async function fetchCurrentVersion(): Promise<string | undefined> {
    const { stdout } = await exec('solana feature status');
    const versions = parseVersions(stdout);
    return versions.length > 0 ? versions[0] : undefined;
}

const localCurrentVersionKey: string = "local-current-version";

export async function getLocalCurrentVersion() {

}

export async function setLocalCurrentVersion() {
    
}