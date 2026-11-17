import { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { PrivacyBanner } from './components/PrivacyBanner';
import { AdPlaceholder } from './components/AdPlaceholder';
import { DropZone } from './components/DropZone';
import { ControlPanel } from './components/ControlPanel';
import { BatchStats } from './components/BatchStats';
import { ImageCard } from './components/ImageCard';
import { BeforeAfterSlider } from './components/BeforeAfterSlider';
import { SeoSection } from './components/SeoSection';
import { Footer } from './components/Footer';
import type { CompressionSettings, ImageFileItem } from './types';
import { processImage, loadImage } from './utils/imageCompressor';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

export default function App() {
  const [items, setItems] = useState<ImageFileItem[]>([]);
  const [inspectingItem, setInspectingItem] = useState<ImageFileItem | null>(null);

  const [settings, setSettings] = useState<CompressionSettings>({
    quality: 0.8,
    format: 'original',
    aspectRatioLocked: true,
    resizeMode: 'none',
    customWidth: null,
    customHeight: null,
    scalePercentage: 100,
  });

  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // Keep track of active items in a ref for unmount cleanup
  const activeItemsRef = useRef(items);
  useEffect(() => {
    activeItemsRef.current = items;
  }, [items]);

  useEffect(() => {
    return () => {
      activeItemsRef.current.forEach((item) => {
        if (item.originalPreviewUrl) URL.revokeObjectURL(item.originalPreviewUrl);
        if (item.compressedPreviewUrl) URL.revokeObjectURL(item.compressedPreviewUrl);
      });
    };
  }, []);

  // Process a single image item given specific settings
  const processSingleItem = async (
    item: ImageFileItem,
    currentSettings: CompressionSettings
  ): Promise<ImageFileItem> => {
    try {
      const result = await processImage(
        item.originalPreviewUrl,
        item.originalSize,
        item.originalWidth,
        item.originalHeight,
        item.originalFormat,
        currentSettings
      );

      // Clean up previous compressed preview URL if any
      if (item.compressedPreviewUrl) {
        URL.revokeObjectURL(item.compressedPreviewUrl);
      }

      return {
        ...item,
        isProcessing: false,
        compressedBlob: result.blob,
        compressedSize: result.size,
        compressedWidth: result.width,
        compressedHeight: result.height,
        compressedPreviewUrl: result.previewUrl,
        compressedFormat: result.mimeType,
        savedPercentage: result.savedPercentage,
        error: undefined,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Compression failed';
      console.error(`Failed to process ${item.name}:`, errorMessage);
      return {
        ...item,
        isProcessing: false,
        error: errorMessage,
      };
    }
  };

  // Recompress all images when settings change (debounced)
  const debounceTimerRef = useRef<number | null>(null);

  const reprocessAll = useCallback(
    (newSettings: CompressionSettings) => {
      if (items.length === 0) return;

      // Mark all as processing
      setItems((prev) =>
        prev.map((i) => ({
          ...i,
          isProcessing: true,
        }))
      );

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = window.setTimeout(async () => {
        setItems((currentItems) => {
          // Process in parallel
          Promise.all(
            currentItems.map((item) => processSingleItem(item, newSettings))
          ).then((updatedItems) => {
            setItems(updatedItems);
            // If currently inspecting an item, update it too
            if (inspectingItem) {
              const updatedInspect = updatedItems.find((i) => i.id === inspectingItem.id);
              if (updatedInspect) setInspectingItem(updatedInspect);
            }
          });
          return currentItems;
        });
      }, 150);
    },
    [items.length, inspectingItem]
  );

  const handleSettingsChange = (newSettings: CompressionSettings) => {
    setSettings(newSettings);
    reprocessAll(newSettings);
  };

  // Handle new files dropped or selected
  const handleFilesSelected = async (files: File[]) => {
    const newItems: ImageFileItem[] = [];

    for (const file of files) {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const previewUrl = URL.createObjectURL(file);

      try {
        const img = await loadImage(previewUrl);
        const item: ImageFileItem = {
          id,
          file,
          name: file.name,
          originalSize: file.size,
          originalWidth: img.naturalWidth || img.width,
          originalHeight: img.naturalHeight || img.height,
          originalFormat: file.type || 'image/jpeg',
          originalPreviewUrl: previewUrl,
          isProcessing: true,
          compressedBlob: null,
          compressedSize: file.size,
          compressedWidth: img.naturalWidth || img.width,
          compressedHeight: img.naturalHeight || img.height,
          compressedPreviewUrl: null,
          compressedFormat: file.type || 'image/jpeg',
          savedPercentage: 0,
        };
        newItems.push(item);
      } catch (err) {
        console.error('Could not load image info for:', file.name, err);
      }
    }

    if (newItems.length === 0) return;

    // Append to existing items
    setItems((prev) => [...prev, ...newItems]);

    // Process new items immediately
    Promise.all(
      newItems.map((item) => processSingleItem(item, settingsRef.current))
    ).then((processedNewItems) => {
      setItems((prev) =>
        prev.map((item) => {
          const processed = processedNewItems.find((p) => p.id === item.id);
          return processed || item;
        })
      );
    });
  };

  // Remove single item
  const handleRemoveItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        if (target.originalPreviewUrl) URL.revokeObjectURL(target.originalPreviewUrl);
        if (target.compressedPreviewUrl) URL.revokeObjectURL(target.compressedPreviewUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
    if (inspectingItem?.id === id) {
      setInspectingItem(null);
    }
  };

  // Clear all items
  const handleClearAll = () => {
    items.forEach((item) => {
      if (item.originalPreviewUrl) URL.revokeObjectURL(item.originalPreviewUrl);
      if (item.compressedPreviewUrl) URL.revokeObjectURL(item.compressedPreviewUrl);
    });
    setItems([]);
    setInspectingItem(null);
  };

  // First image ratio for aspect ratio calculation
  const referenceAspectRatio =
    items.length > 0 && items[0].originalWidth && items[0].originalHeight
      ? items[0].originalWidth / items[0].originalHeight
      : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* SEO Title & Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Zero-Server Client-Side Compression</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Compress & Resize Images{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">
              In Your Browser
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Reduce image file sizes by up to 90% without compromising visual quality.
            Convert to WebP, resize for social media, and export in batch — 100% private.
          </p>
        </div>

        {/* Ad Placeholder 1: Top Leaderboard */}
        <AdPlaceholder slot="top" />

        {/* 100% Private Badge Notice */}
        <PrivacyBanner />

        {/* Upload Zone */}
        <DropZone onFilesSelected={handleFilesSelected} />

        {/* Settings Control Panel */}
        <ControlPanel
          settings={settings}
          onChange={handleSettingsChange}
          referenceAspectRatio={referenceAspectRatio}
          hasImages={items.length > 0}
        />

        {/* Batch Stats & Summary Actions */}
        {items.length > 0 && (
          <BatchStats
            items={items}
            format={settings.format}
            onClearAll={handleClearAll}
            onOpenInspector={(item) => setInspectingItem(item)}
          />
        )}

        {/* Image Results Grid */}
        {items.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-600" />
                <span>Processed Images ({items.length})</span>
              </h3>
              <span className="text-xs text-slate-400">
                Click "Compare" to inspect Before vs After quality
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => (
                <ImageCard
                  key={item.id}
                  item={item}
                  format={settings.format}
                  onRemove={handleRemoveItem}
                  onInspect={(it) => setInspectingItem(it)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Ad Placeholder 2: Bottom Banner */}
        <AdPlaceholder slot="bottom" />

        {/* SEO Guide & FAQ Section */}
        <SeoSection />
      </main>

      {/* Before / After Split Slider Modal */}
      {inspectingItem && (
        <BeforeAfterSlider
          item={inspectingItem}
          allItems={items}
          onClose={() => setInspectingItem(null)}
          onSelectItem={(it) => setInspectingItem(it)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
