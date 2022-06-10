import { fetchCurrentVersion } from "./version-service";
const util = require('util');
const exec = util.promisify(require('child_process').exec);

describe('fetch tests', function () {
    it('fetch success', async function () {
        const version = await fetchCurrentVersion();
    });
});