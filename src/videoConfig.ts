export const R2_BUCKET_NAME = "my-video-bucket";
export const R2_OBJECT_KEY = "e03.mp4";
export const R2_OBJECT_PATH = `${R2_BUCKET_NAME}/${R2_OBJECT_KEY}`;

export const R2_DASHBOARD_OBJECT_URL =
  "https://dash.cloudflare.com/00222bbe2e4e9a2a5cb2404611a3ab42/r2/default/buckets/my-video-bucket/objects/e03.mp4/details";

export const R2_S3_API_OBJECT_URL =
  "https://00222bbe2e4e9a2a5cb2404611a3ab42.r2.cloudflarestorage.com/my-video-bucket/e03.mp4";

export const R2_PUBLIC_DEVELOPMENT_URL =
  "https://pub-db2385bfceac49e69829e162fbed9b57.r2.dev";

export const R2_PUBLIC_OBJECT_URL = `${R2_PUBLIC_DEVELOPMENT_URL}/${R2_OBJECT_KEY}`;

const configuredVideoUrl = import.meta.env.VITE_R2_VIDEO_URL?.trim();

export const VIDEO_SOURCE_URL = configuredVideoUrl || R2_PUBLIC_OBJECT_URL;
export const HAS_PUBLIC_VIDEO_URL = Boolean(VIDEO_SOURCE_URL);
export const VIDEO_SOURCE_KIND = configuredVideoUrl
  ? "CUSTOM VIDEO URL"
  : "R2 PUBLIC DEVELOPMENT URL";
