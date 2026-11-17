import JSZip from 'jszip';
import type { ImageFileItem, OutputFormat } from '../types';
import { getOutputFilename } from './formatters';

export async function downloadSingleImage(item: ImageFileItem, format: OutputFormat) {
  if (!item.compressedBlob) return;

  const filename = getOutputFilename(item.name, format, item.originalFormat);
  const url = URL.createObjectURL(item.compressedBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadAllImagesAsZip(
  items: ImageFileItem[],
  format: OutputFormat,
  onProgress?: (progressPercent: number) => void
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder('pixeldiet-compressed-images') || zip;

  const usedNames = new Set<string>();

  items.forEach((item, index) => {
    if (!item.compressedBlob) return;

    let filename = getOutputFilename(item.name, format, item.originalFormat);
    if (usedNames.has(filename)) {
      const extIndex = filename.lastIndexOf('.');
      const base = extIndex !== -1 ? filename.substring(0, extIndex) : filename;
      const ext = extIndex !== -1 ? filename.substring(extIndex) : '';
      filename = `${base}-${index + 1}${ext}`;
    }
    usedNames.add(filename);

    folder.file(filename, item.compressedBlob);
  });

  const content = await zip.generateAsync(
    {
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    },
    (metadata) => {
      if (onProgress) {
        onProgress(Math.round(metadata.percent));
      }
    }
  );

  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  const timestamp = new Date().toISOString().slice(0, 10);
  a.download = `pixeldiet-compressed-${timestamp}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
