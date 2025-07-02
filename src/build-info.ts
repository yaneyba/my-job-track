// Auto-generated build information
// This file is created automatically during the build process

export interface BuildInfo {
  buildNumber: string;
  buildDate: string;
  gitBranch: string;
  gitHash: string;
  version: string;
  environment: string;
}

export const BUILD_INFO: BuildInfo = {
  "buildNumber": "20250702032330i-i4ec4lk",
  "buildDate": "2025-07-02T03:23:30.102Z",
  "gitBranch": "unknown",
  "gitHash": "lfniu1b",
  "version": "1.0.0-build.20250702032115-pf36cch",
  "environment": "development"
};

export const getBuildVersion = (): string => {
  return `${BUILD_INFO.version}`;
};

export const getFullBuildInfo = (): string => {
  return `v${BUILD_INFO.version} (build ${BUILD_INFO.buildNumber})`;
};

export const getBuildDate = (): Date => {
  return new Date(BUILD_INFO.buildDate);
};
