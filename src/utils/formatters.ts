import type { OutputFormat, SocialPreset } from '../types';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function calculateSavings(original: number, compressed: number) {
  if (!original || !compressed) return { percentage: 0, diffBytes: 0 };
  const diffBytes = original - compressed;
  const percentage = Math.round((diffBytes / original) * 100);
  return { percentage, diffBytes };
}

export function getMimeType(format: OutputFormat, originalMime: string): string {
  if (format === 'original') {
    if (originalMime === 'image/png' || originalMime === 'image/jpeg' || originalMime === 'image/webp') {
      return originalMime;
    }
    return 'image/jpeg';
  }
  return format;
}

export function getExtensionForMime(mime: string): string {
  switch (mime) {
    case 'image/webp':
      return 'webp';
    case 'image/png':
      return 'png';
    case 'image/jpeg':
    default:
      return 'jpg';
  }
}

export function getOutputFilename(
  originalName: string,
  format: OutputFormat,
  originalMime: string,
  suffix = '-compressed'
): string {
  const dotIndex = originalName.lastIndexOf('.');
  const baseName = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
  const targetMime = getMimeType(format, originalMime);
  const ext = getExtensionForMime(targetMime);
  return `${baseName}${suffix}.${ext}`;
}

export const SOCIAL_PRESETS: SocialPreset[] = [
  { id: 'ig-square', name: 'Instagram Square', platform: 'Instagram', width: 1080, height: 1080 },
  { id: 'ig-story', name: 'Instagram Story / Reel', platform: 'Instagram', width: 1080, height: 1920 },
  { id: 'yt-thumb', name: 'YouTube Thumbnail', platform: 'YouTube', width: 1280, height: 720 },
  { id: 'web-banner', name: 'Web Banner / Full HD', platform: 'Web', width: 1920, height: 1080 },
  { id: 'tw-post', name: 'Twitter / X Post', platform: 'Twitter', width: 1200, height: 675 },
  { id: 'tw-header', name: 'Twitter / X Header', platform: 'Twitter', width: 1500, height: 500 },
  { id: 'li-banner', name: 'LinkedIn Banner', platform: 'LinkedIn', width: 1584, height: 396 },
  { id: 'avatar', name: 'Profile Avatar', platform: 'General', width: 400, height: 400 },
];
