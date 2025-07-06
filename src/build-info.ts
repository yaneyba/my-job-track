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
  "buildNumber": "20250706231657g-gawy4cc",
  "buildDate": "2025-07-06T23:16:57.404Z",
  "gitBranch": "unknown",
  "gitHash": "cyev6w7",
  "version": "1.0.0-build.202507062316144-4vjy42z",
  "environment": "production"
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
