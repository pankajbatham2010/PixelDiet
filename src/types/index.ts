export type OutputFormat = 'original' | 'image/webp' | 'image/jpeg' | 'image/png';

export interface SocialPreset {
  id: string;
  name: string;
  platform: 'Instagram' | 'YouTube' | 'Twitter' | 'LinkedIn' | 'Web' | 'General';
  width: number;
  height: number;
  iconName?: string;
}

export interface CompressionSettings {
  quality: number; // 0.1 to 1.0 (10% to 100%)
  format: OutputFormat;
  aspectRatioLocked: boolean;
  resizeMode: 'none' | 'preset' | 'custom' | 'percentage';
  customWidth: number | null;
  customHeight: number | null;
  scalePercentage: number; // 10 to 100%
}

export interface ImageFileItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalWidth: number;
  originalHeight: number;
  originalFormat: string;
  originalPreviewUrl: string;

  // Processed state
  isProcessing: boolean;
  compressedBlob: Blob | null;
  compressedSize: number;
  compressedWidth: number;
  compressedHeight: number;
  compressedPreviewUrl: string | null;
  compressedFormat: string;
  savedPercentage: number;
  error?: string;
}
