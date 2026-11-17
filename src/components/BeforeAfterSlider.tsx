import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ImageFileItem } from '../types';
import { formatBytes } from '../utils/formatters';
import { X, ZoomIn, ZoomOut, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface BeforeAfterSliderProps {
  item: ImageFileItem;
  allItems: ImageFileItem[];
  onClose: () => void;
  onSelectItem: (item: ImageFileItem) => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  item,
  allItems,
  onClose,
  onSelectItem,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1, 1.5, 2
  const containerRef = useRef<HTMLDivElement>(null);

  const currentIndex = allItems.findIndex((i) => i.id === item.id);

  // Navigate between images in batch
  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onSelectItem(allItems[currentIndex - 1]);
    }
  }, [currentIndex, allItems, onSelectItem]);

  const handleNext = useCallback(() => {
    if (currentIndex < allItems.length - 1) {
      onSelectItem(allItems[currentIndex + 1]);
    }
  }, [currentIndex, allItems, onSelectItem]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pos);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updatePosition(e.clientX);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    updatePosition(e.touches[0].clientX);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      updatePosition(e.touches[0].clientX);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, updatePosition]);

  const originalSrc = item.originalPreviewUrl;
  const compressedSrc = item.compressedPreviewUrl || item.originalPreviewUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 shrink-0">
          <div className="flex items-center space-x-3 truncate">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="text-sm font-bold text-white truncate">{item.name}</h3>
              <p className="text-xs text-slate-400">
                Drag slider to inspect compression quality & artifacts
              </p>
            </div>
          </div>

          {/* Controls: Zoom, Navigation, Close */}
          <div className="flex items-center space-x-2">
            {/* Zoom Controls */}
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs text-slate-300">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
                className="p-1.5 hover:text-white transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono">{Math.round(zoomLevel * 100)}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.5))}
                className="p-1.5 hover:text-white transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Batch Navigation */}
            {allItems.length > 1 && (
              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs text-slate-300">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={handlePrev}
                  className="p-1.5 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                  title="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono">
                  {currentIndex + 1}/{allItems.length}
                </span>
                <button
                  type="button"
                  disabled={currentIndex === allItems.length - 1}
                  onClick={handleNext}
                  className="p-1.5 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                  title="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Subheader Comparison Badges */}
        <div className="flex items-center justify-between px-6 py-2.5 bg-slate-900 border-b border-slate-800/80 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 font-bold border border-slate-700">
              Original (Before)
            </span>
            <span className="text-slate-400 font-mono">
              {formatBytes(item.originalSize)} &bull; {item.originalWidth}×{item.originalHeight}px
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-mono">
              {formatBytes(item.compressedSize)} &bull; {item.compressedWidth}×{item.compressedHeight}px
            </span>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40">
              Compressed (-{item.savedPercentage}%)
            </span>
          </div>
        </div>

        {/* Interactive Comparison Canvas Area */}
        <div className="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center select-none p-4">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className="relative max-w-full max-h-full cursor-ew-resize overflow-hidden rounded-xl shadow-2xl border border-slate-800 flex items-center justify-center"
            style={{
              aspectRatio: `${item.originalWidth} / ${item.originalHeight}`,
              width: zoomLevel === 1 ? 'auto' : `${zoomLevel * 100}%`,
              height: zoomLevel === 1 ? '100%' : 'auto',
            }}
          >
            {/* Layer 1: Compressed Image (Right / Background) */}
            <img
              src={compressedSrc}
              alt="Compressed preview"
              className="w-full h-full object-contain pointer-events-none select-none block"
            />

            {/* Layer 2: Original Image (Left / Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none select-none"
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
              }}
            >
              <img
                src={originalSrc}
                alt="Original preview"
                className="w-full h-full object-contain pointer-events-none select-none block"
              />
            </div>

            {/* Draggable Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-900 shadow-xl flex items-center justify-center font-bold text-xs border-2 border-indigo-600">
                <div className="flex items-center -space-x-1">
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* On-canvas corner floating labels */}
            <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/60 text-[11px] font-semibold text-white pointer-events-none backdrop-blur-xs">
              BEFORE (ORIGINAL)
            </div>
            <div className="absolute top-3 right-3 px-2 py-1 rounded bg-indigo-600/80 text-[11px] font-semibold text-white pointer-events-none backdrop-blur-xs">
              AFTER (COMPRESSED)
            </div>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="px-6 py-2.5 bg-slate-950/80 border-t border-slate-800 text-center text-xs text-slate-500 shrink-0">
          Drag the center handle horizontally to compare details &bull; Use Arrow keys or mouse
        </div>
      </div>
    </div>
  );
};
