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
  "buildNumber": "20250707205430c-cs1raib",
  "buildDate": "2025-07-07T20:54:30.588Z",
  "gitBranch": "unknown",
  "gitHash": "t1dxpa7",
  "version": "1.0.0-build.202507072043546-6bc09ab",
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
