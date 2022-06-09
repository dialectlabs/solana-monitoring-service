import { compareVersionsAscending, compareVersionsDescending } from "./parsing-utils";
  
describe('version parsing tests', function () {
  it('version success', function () {
      const v11 = "1.20.4";
      const v21 = "1.20.4";
      const compared1 = compareVersionsAscending(v11, v21);
      expect(compared1).toBe(0);

      const v12 = "1.20.1";
      const v22 = "1.20.4";
      const compared2 = compareVersionsAscending(v12, v22);
      expect(compared2 < 0).toBe(true);

      const v13 = "1.20.4";
      const v23 = "1.20.1";
      const compared3 = compareVersionsAscending(v13, v23);
      expect(compared3 > 0).toBe(true);

      const v14 = "1.20.4";
      const v24 = "10.20.4";
      const compared4 = compareVersionsAscending(v14, v24);
      expect(compared4 < 0).toBe(true);

      const v15 = "1.20.4";
      const v25 = "1.30.4";
      const compared5 = compareVersionsAscending(v15, v25);
      expect(compared5 < 0).toBe(true);
  });

  it('recursive version fail', function () {
      const v11 = "1.20";
      const v21 = "1.20.4";
      const compared1 = compareVersionsAscending(v11, v21);
      expect(compared1 < 0).toBe(true);

      const v12 = "1.20.4";
      const v22 = "1.20";
      const compared2 = compareVersionsAscending(v12, v22);
      expect(compared2 < 0).toBe(true);

      const v13 = "1.20.4";
      const v23 = "";
      const compared3 = compareVersionsAscending(v13, v23);
      expect(compared3 < 0).toBe(true);
  });

  it('sorting success', function () {
      const versions = ["1.8.12", "1.8.14", "1.9.19", "1.10.22", "1.10.24", "1.11.0"];
      console.log(versions);

      versions.sort(compareVersionsDescending);
      console.log(versions);

      expect(versions[0]).toBe("1.11.0");
      expect(versions[versions.length - 1]).toBe("1.8.12");
  });
});
