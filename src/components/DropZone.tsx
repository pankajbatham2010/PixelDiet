import React, { useRef, useState, useEffect, useCallback } from 'react';
import { UploadCloud, Sparkles, FileImage } from 'lucide-react';

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
  isLoading?: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ onFilesSelected, isLoading = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = filterImageFiles(Array.from(e.dataTransfer.files));
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = filterImageFiles(Array.from(e.target.files));
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
    // Reset file input so user can pick the same file again if desired
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filterImageFiles = (files: File[]): File[] => {
    return files.filter((file) => {
      const mime = file.type.toLowerCase();
      const name = file.name.toLowerCase();
      return (
        mime.startsWith('image/') ||
        name.endsWith('.jpg') ||
        name.endsWith('.jpeg') ||
        name.endsWith('.png') ||
        name.endsWith('.webp') ||
        name.endsWith('.avif') ||
        name.endsWith('.bmp')
      );
    });
  };

  // Listen for global clipboard paste (Ctrl+V / Cmd+V)
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const imageFiles = filterImageFiles(Array.from(e.clipboardData.files));
        if (imageFiles.length > 0) {
          e.preventDefault();
          onFilesSelected(imageFiles);
        }
      }
    },
    [onFilesSelected]
  );

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  // Generate high quality sample canvas images for 1-click test
  const loadSampleImage = (type: 'photo' | 'illustration') => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (type === 'photo') {
      canvas.width = 1920;
      canvas.height = 1080;

      // Sunset gradient landscape
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.3, '#4338ca');
      grad.addColorStop(0.6, '#db2777');
      grad.addColorStop(0.8, '#f97316');
      grad.addColorStop(1, '#fde047');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Glowing sun
      const sunGrad = ctx.createRadialGradient(960, 750, 20, 960, 750, 180);
      sunGrad.addColorStop(0, '#ffffff');
      sunGrad.addColorStop(0.5, '#fef08a');
      sunGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(960, 750, 180, 0, Math.PI * 2);
      ctx.fill();

      // Mountain silhouettes with fine details
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(0, 1080);
      ctx.lineTo(0, 800);
      ctx.lineTo(350, 620);
      ctx.lineTo(700, 850);
      ctx.lineTo(1050, 580);
      ctx.lineTo(1450, 820);
      ctx.lineTo(1700, 690);
      ctx.lineTo(1920, 850);
      ctx.lineTo(1920, 1080);
      ctx.closePath();
      ctx.fill();

      // Foreground hills
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.moveTo(0, 1080);
      ctx.lineTo(0, 920);
      ctx.bezierCurveTo(400, 850, 800, 950, 1200, 890);
      ctx.bezierCurveTo(1500, 850, 1750, 930, 1920, 910);
      ctx.lineTo(1920, 1080);
      ctx.closePath();
      ctx.fill();

      // Star particles for compression test
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 120; i++) {
        const x = (i * 12345) % canvas.width;
        const y = (i * 6789) % 550;
        const r = (i % 3) + 1;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.font = 'bold 44px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.textAlign = 'center';
      ctx.fillText('PixelDiet Sample High-Res Landscape (1920×1080)', 960, 140);
    } else {
      canvas.width = 1200;
      canvas.height = 1200;

      // Colorful abstract illustration
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#06b6d4');
      grad.addColorStop(0.5, '#3b82f6');
      grad.addColorStop(1, '#8b5cf6');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Overlapping geometric glass rings
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.arc(600, 600, 100 + i * 55, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 + (i % 3) * 0.1})`;
        ctx.lineWidth = 12 + i * 2;
        ctx.stroke();
      }

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 50px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('PixelDiet Test Artwork', 600, 580);
      ctx.font = '24px system-ui, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fillText('Square High Quality Sample (1200×1200)', 600, 640);
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const sampleFile = new File(
          [blob],
          type === 'photo' ? 'sample-landscape-hd.jpg' : 'sample-artwork-square.png',
          { type: type === 'photo' ? 'image/jpeg' : 'image/png' }
        );
        onFilesSelected([sampleFile]);
      }
    }, type === 'photo' ? 'image/jpeg' : 'image/png', 0.95);
  };

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 select-none ${
          isDragOver
            ? 'border-indigo-600 bg-indigo-50/70 scale-[1.01] shadow-lg shadow-indigo-500/10'
            : 'border-slate-300/80 bg-white hover:border-indigo-400 hover:bg-slate-50/60 shadow-xs'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif,image/bmp,.jpg,.jpeg,.png,.webp,.avif"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Upload Icon */}
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all ${
              isDragOver
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 rotate-3'
                : 'bg-indigo-50 text-indigo-600'
            }`}
          >
            <UploadCloud className="w-10 h-10" />
          </div>

          {/* Headline & Description */}
          <div className="space-y-1.5 max-w-lg">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Drag & Drop your images here
            </h3>
            <p className="text-sm text-slate-500">
              Supports <strong className="text-slate-700 font-semibold">JPG, PNG, and WebP</strong> files.
              Single or batch uploads supported.
            </p>
          </div>

          {/* Action Button & Paste Hint */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              disabled={isLoading}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <FileImage className="w-4 h-4" />
              <span>Select Files from Computer</span>
            </button>

            <span className="text-xs text-slate-400 hidden sm:inline">or press Ctrl+V to paste</span>
          </div>

          {/* Quick Sample Buttons */}
          <div
            className="pt-4 border-t border-slate-100 flex items-center flex-wrap justify-center gap-2 text-xs text-slate-500"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="flex items-center gap-1 font-medium text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              No images handy? Try a sample:
            </span>
            <button
              type="button"
              onClick={() => loadSampleImage('photo')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-medium transition-colors border border-slate-200/60 cursor-pointer"
            >
              HD Landscape (JPG)
            </button>
            <button
              type="button"
              onClick={() => loadSampleImage('illustration')}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-medium transition-colors border border-slate-200/60 cursor-pointer"
            >
              Artwork (PNG)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
