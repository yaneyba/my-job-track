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
  "buildNumber": "20250707210408s-sjy5fll",
  "buildDate": "2025-07-07T21:04:08.793Z",
  "gitBranch": "unknown",
  "gitHash": "e8z7yk1",
  "version": "1.0.0-build.20250707205430c-cs1raib",
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
