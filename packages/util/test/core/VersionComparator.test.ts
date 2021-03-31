import {VersionComparator} from "../../src/core/VersionComparator";
import type {ComparisonResult} from "../../src/core/VersionComparator";

interface TestProps {
    currentVersion: string;
    latestVersion: string;
    expectedResult?: ComparisonResult;
}

test.each`
    currentVersion | latestVersion
    ${""}          | ${""}
    ${"a.a.a"}     | ${"1.1.1"}
    ${"1.1.1"}     | ${"1.b.b"}
    ${"1.1.1"}     | ${"b.1.b"}
    ${"1.1.1"}     | ${"b.b.1"}
    ${"1.1.1"}     | ${"1.1.1-1"}
`("should throw error with invalid version: currentVersion[$currentVersion], latestVersion[$latestVersion]", ({currentVersion, latestVersion}: TestProps) => {
    expect(() => VersionComparator.compare(currentVersion, latestVersion)).toThrowError("invalid version string");
});

test.each`
    currentVersion | latestVersion | expectedResult
    ${"0.0.0"}     | ${"0.0.0"}    | ${"no-upgrade"}
    ${"0.0.1"}     | ${"0.0.1"}    | ${"no-upgrade"}
    ${"0.1.0"}     | ${"0.1.0"}    | ${"no-upgrade"}
    ${"1.0.0"}     | ${"1.0.0"}    | ${"no-upgrade"}
    ${"0.1.1"}     | ${"0.1.1"}    | ${"no-upgrade"}
    ${"1.0.1"}     | ${"1.0.1"}    | ${"no-upgrade"}
    ${"1.1.0"}     | ${"1.1.0"}    | ${"no-upgrade"}
    ${"1.1.1"}     | ${"1.1.1"}    | ${"no-upgrade"}
    ${"1.0.0"}     | ${"0.0.0"}    | ${"no-upgrade"}
    ${"1.1.0"}     | ${"1.0.0"}    | ${"no-upgrade"}
    ${"1.1.1"}     | ${"1.1.0"}    | ${"no-upgrade"}
    ${"2.1.1"}     | ${"1.1.0"}    | ${"no-upgrade"}
    ${"2.1.1"}     | ${"1.2.0"}    | ${"no-upgrade"}
`("should return no-upgrade: currentVersion[$currentVersion], latestVersion[$latestVersion]", ({currentVersion, latestVersion, expectedResult}: TestProps) => {
    expect(VersionComparator.compare(currentVersion, latestVersion)).toBe(expectedResult);
});

test.each`
    currentVersion | latestVersion | expectedResult
    ${"0.0.0"}     | ${"1.0.0"}    | ${"major-upgrade"}
    ${"0.0.1"}     | ${"1.0.0"}    | ${"major-upgrade"}
    ${"0.1.1"}     | ${"1.0.0"}    | ${"major-upgrade"}
`("should return major-upgrade: currentVersion[$currentVersion], latestVersion[$latestVersion]", ({currentVersion, latestVersion, expectedResult}: TestProps) => {
    expect(VersionComparator.compare(currentVersion, latestVersion)).toBe(expectedResult);
});

test.each`
    currentVersion | latestVersion | expectedResult
    ${"1.0.0"}     | ${"1.1.0"}    | ${"minor-upgrade"}
    ${"1.0.1"}     | ${"1.1.0"}    | ${"minor-upgrade"}
    ${"1.1.0"}     | ${"1.2.0"}    | ${"minor-upgrade"}
`("should return minor-upgrade: currentVersion[$currentVersion], latestVersion[$latestVersion]", ({currentVersion, latestVersion, expectedResult}: TestProps) => {
    expect(VersionComparator.compare(currentVersion, latestVersion)).toBe(expectedResult);
});

test.each`
    currentVersion | latestVersion | expectedResult
    ${"1.1.0"}     | ${"1.1.1"}    | ${"patch-upgrade"}
    ${"1.0.1"}     | ${"1.0.2"}    | ${"patch-upgrade"}
    ${"1.2.0"}     | ${"1.2.1"}    | ${"patch-upgrade"}
`("should return patch-upgrade: currentVersion[$currentVersion], latestVersion[$latestVersion]", ({currentVersion, latestVersion, expectedResult}: TestProps) => {
    expect(VersionComparator.compare(currentVersion, latestVersion)).toBe(expectedResult);
});
