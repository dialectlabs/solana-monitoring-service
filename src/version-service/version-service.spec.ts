import { fetchFeatureSet } from './version-service';
jest.setTimeout(10000000);

describe('fetch tests', function () {
  it('fetch success', async function () {
    const version = await fetchFeatureSet();
    console.log(version);
  });
});
