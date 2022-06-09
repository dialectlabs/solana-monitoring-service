
export function compareVersionsAscending(version1: string, version2: string): number {
    return compareVersions(version1, version2, true);
}

export function compareVersionsDescending(version1: string, version2: string): number {
    return compareVersions(version1, version2, false);
}

function compareVersions(version1: string, version2: string, ascending: boolean = true): number {
    try {
        const vlist1 = version1.split('.').map((e) => parseInt(e));
        const vlist2 = version2.split('.').map((e) => parseInt(e));
        return recursiveVersionSort(vlist1, vlist2) * (ascending ? 1 : -1);
    } catch {
        return -1;
    }
}

export function recursiveVersionSort(vlist1: number[], vlist2: number[]): number {
    if (vlist1.length != vlist2.length || vlist1.length < 1) {
      return -1;
    }
    const num1 = vlist1[0]!;
    const num2 = vlist2[0]!;
    if (vlist1.length == 1 || num1 != num2) {
        return num1 - num2;
    }
    return recursiveVersionSort(vlist1.slice(1, undefined), vlist2.slice(1, undefined));
}

const versionRegexp = /\d+\.\d{1,2}\.\d{1,2}/;
const versionLineRegexp = /^((\d+\.\d{1,2}\.\d{1,2}){1}[,\s]{1,2})+\s*\d+(\s+\d{1,2}\.\d{2}\%){2}/gm;

export function parseVersions(content: string): string[] {
    console.log(content);
    const lineMatches = content.match(versionLineRegexp);
    if (lineMatches == null) {
        return [];
    }
    const versions = lineMatches!.map((lineMatch) => lineMatch.match(versionRegexp) ?? []).flat();
    return versions.sort(compareVersionsDescending);
}