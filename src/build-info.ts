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
  "buildNumber": "20251109200833d-dl5uik1",
  "buildDate": "2025-11-09T20:08:33.900Z",
  "gitBranch": "unknown",
  "gitHash": "5vhvwx9",
  "version": "1.0.0-build.20250709155913q-qwc4iab",
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
