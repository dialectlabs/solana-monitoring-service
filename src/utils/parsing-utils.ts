import { FeatureRelease } from "src/monitoring.service";

export function pruneOutput(output: String): String[] {
    const columnDelimiterRegExp = /.+\|.+\|.+/gm;
    return [...output.matchAll(columnDelimiterRegExp)]
        .filter((e) => e.length  == 1)
        .map((e) => e[0].trim());
}

export function pruneActiveOutput(content: String): String[] {
    const prunedOutput = pruneOutput(content);
    return prunedOutput.filter((e) => featureSetIsActive(e));
}

export function parseFeatureSetHashFromActiveLine(line: String): FeatureRelease | undefined {
    const columns = line.split('|');
    if (columns.length < 3) {
        return undefined;
    }
    return {
        featureHash: columns[0].trim(),
        description: columns[2].trim()
    };
}

export function parseActiveHashes(content: String): FeatureRelease[] {
    const activeLines = pruneActiveOutput(content);
    const featureReleases: Map<String, FeatureRelease> = new Map(activeLines.map((e) => parseFeatureSetHashFromActiveLine(e)).filter((e) => e).map((e) => [e!.featureHash, e!]));
    return [...featureReleases.values()];
}

export function featureSetIsActive(featureSet: String): boolean {
    const activityLine = featureSet.split('|')[1];
    return activityLine != undefined && !activityLine.includes('inactive') && activityLine.includes('active');
}