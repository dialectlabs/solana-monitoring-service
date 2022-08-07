import {
  parseActiveHashes,
  pruneActiveOutput,
  pruneOutput,
} from './parsing-utils';

describe('feature set parsing tests', function () {
  it('feature set lines success', function () {
    const feature1 =
      'CFK1hRCNy8JJuAAY8Pb2GjLFNdCThS2qwZNe3izzBMgn | active since slot 134352008 | add add_get_processed_sibling_instruction_syscall';
    const feature2 =
      '5ekBxc8itEnPv4NzGJtr8BVVQLNMQuLMNQQj7pHoLNZ9 | active since slot 135216004 | transaction wide compute cap';
    const feature3 =
      'CCu4boMmfLuqcmfTLPHQiUo22ZdUsXjgzPAURYaWt1Bw | active since slot 135216004 | Requestable heap frame size';
    const feature4 =
      'JAN1trEUEtZjgXYzNBYHU9DYd7GnThhXfFP7SzPXkPsG | inactive                    | disable fees sysvar';
    const feature5 =
      'nWBqjr3gpETbiaVj3CBJ3HFC5TMdnJDGt21hnvSTvVZ  | inactive                    | check physical overlapping regions';
    const feature6 =
      'zk1snxsc6Fh3wsGNbbHAJNHiJoYgF29mMnTSusGx5EJ  | inactive                    | enable Zk Token proof program and syscalls';
    const nonFeature1 = '';
    const nonFeature2 = 'To activate features the stake must be >= 95%';
    const nonFeature3 = 'To activate features the RPC nodes must be >= 95%';

    const output = `
    ${feature1}
    ${feature2}
    ${feature3}
    ${feature4}
    ${feature5}
    ${feature6}
    ${nonFeature1}
    ${nonFeature2}
    ${nonFeature3}`;

    const lines = pruneOutput(output);

    expect(lines.length).toBe(6);

    expect(lines.includes(feature1)).toBe(true);
    expect(lines.includes(feature2)).toBe(true);
    expect(lines.includes(feature3)).toBe(true);
    expect(lines.includes(feature4)).toBe(true);
    expect(lines.includes(feature5)).toBe(true);
    expect(lines.includes(feature6)).toBe(true);
  });

  it('feature set active lines success', function () {
    const feature1 =
      'CFK1hRCNy8JJuAAY8Pb2GjLFNdCThS2qwZNe3izzBMgn | active since slot 134352008 | add add_get_processed_sibling_instruction_syscall';
    const feature2 =
      '5ekBxc8itEnPv4NzGJtr8BVVQLNMQuLMNQQj7pHoLNZ9 | active since slot 135216004 | transaction wide compute cap';
    const feature3 =
      'CCu4boMmfLuqcmfTLPHQiUo22ZdUsXjgzPAURYaWt1Bw | active since slot 135216004 | Requestable heap frame size';
    const feature4 =
      'JAN1trEUEtZjgXYzNBYHU9DYd7GnThhXfFP7SzPXkPsG | inactive                    | disable fees sysvar';
    const feature5 =
      'nWBqjr3gpETbiaVj3CBJ3HFC5TMdnJDGt21hnvSTvVZ  | inactive                    | check physical overlapping regions';
    const feature6 =
      'zk1snxsc6Fh3wsGNbbHAJNHiJoYgF29mMnTSusGx5EJ  | inactive                    | enable Zk Token proof program and syscalls';

    const output = `
    ${feature1}
    ${feature2}
    ${feature3}
    ${feature4}
    ${feature5}
    ${feature6}`;

    const lines = pruneActiveOutput(output);

    expect(lines.length).toBe(3);

    expect(lines.includes(feature1)).toBe(true);
    expect(lines.includes(feature2)).toBe(true);
    expect(lines.includes(feature3)).toBe(true);
  });

  it('feature set active hashes success', function () {
    const feature1 =
      'CFK1hRCNy8JJuAAY8Pb2GjLFNdCThS2qwZNe3izzBMgn | active since slot 134352008 | add add_get_processed_sibling_instruction_syscall';
    const feature2 =
      '5ekBxc8itEnPv4NzGJtr8BVVQLNMQuLMNQQj7pHoLNZ9 | active since slot 135216004 | transaction wide compute cap';
    const feature3 =
      'CCu4boMmfLuqcmfTLPHQiUo22ZdUsXjgzPAURYaWt1Bw | active since slot 135216004 | Requestable heap frame size';
    const feature4 =
      'JAN1trEUEtZjgXYzNBYHU9DYd7GnThhXfFP7SzPXkPsG | inactive                    | disable fees sysvar';
    const feature5 =
      'nWBqjr3gpETbiaVj3CBJ3HFC5TMdnJDGt21hnvSTvVZ  | inactive                    | check physical overlapping regions';
    const feature6 =
      'zk1snxsc6Fh3wsGNbbHAJNHiJoYgF29mMnTSusGx5EJ  | inactive                    | enable Zk Token proof program and syscalls';

    const output = `
    ${feature1}
    ${feature2}
    ${feature3}
    ${feature4}
    ${feature5}
    ${feature6}`;

    const hashes = parseActiveHashes(output).map((it) => it.featureHash);

    expect(hashes.length).toBe(3);

    expect(hashes.includes(feature1)).toBe(false);
    expect(hashes.includes(feature2)).toBe(false);
    expect(hashes.includes(feature3)).toBe(false);

    expect(
      hashes.includes('CFK1hRCNy8JJuAAY8Pb2GjLFNdCThS2qwZNe3izzBMgn'),
    ).toBe(true);
    expect(
      hashes.includes('5ekBxc8itEnPv4NzGJtr8BVVQLNMQuLMNQQj7pHoLNZ9'),
    ).toBe(true);
    expect(
      hashes.includes('CCu4boMmfLuqcmfTLPHQiUo22ZdUsXjgzPAURYaWt1Bw'),
    ).toBe(true);
  });
});
