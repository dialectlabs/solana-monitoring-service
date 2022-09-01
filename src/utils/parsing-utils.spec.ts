import { parseFeatureSDKFile } from './parsing-utils';

describe('feature set parsing tests', function () {
  it('features parsed correclty', async function () {
    const feature1 = {
      featureHash: 'secp256k1_program_enabled',
      description: 'secp256k1 program',
    };

    const feature2 = {
      featureHash: 'add_get_processed_sibling_instruction_syscall',
      description: 'add add_get_processed_sibling_instruction_syscall',
    };

    const feature3 = {
      featureHash: 'cap_accounts_data_allocations_per_transaction',
      description: 'cap accounts data allocations per transaction #27375',
    };

    const feature4 = {
      featureHash: 'vote_state_update_credit_per_dequeue',
      description:
        'Calculate vote credits for VoteStateUpdate per vote dequeue to match credit awards for Vote instruction',
    };

    const lines = await parseFeatureSDKFile();

    // 01.09 - 120 features was released
    expect(lines.length).toBe(120);

    expect(
      lines.find(
        (it) =>
          it.featureHash === feature1.featureHash &&
          it.description === feature1.description,
      ),
    ).toEqual(feature1);

    expect(
      lines.find(
        (it) =>
          it.featureHash === feature2.featureHash &&
          it.description === feature2.description,
      ),
    ).toEqual(feature2);

    expect(
      lines.find(
        (it) =>
          it.featureHash === feature3.featureHash &&
          it.description === feature3.description,
      ),
    ).toEqual(feature3);

    expect(
      lines.find(
        (it) =>
          it.featureHash === feature4.featureHash &&
          it.description === feature4.description,
      ),
    ).toEqual(feature4);
  });
});
