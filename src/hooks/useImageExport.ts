'use client';

import { useCanvasStore } from './useCanvasState';

export interface ExportOptions {
  format?: 'png' | 'jpg';
  quality?: number;
  scale?: number;
  includeWatermark?: boolean;
  watermarkText?: string;
  watermarkPosition?:
    | 'bottom-right'
    | 'bottom-left'
    | 'top-right'
    | 'top-left'
    | 'center';
}

export function useImageExport() {
  const { exportSettings, width, height } = useCanvasStore();

  const exportImage = async (
    stageRef: React.RefObject<any>,
    options: ExportOptions = {}
  ): Promise<string | null> => {
    const stage = stageRef.current;
    if (!stage) {
      console.error('Stage reference not found');
      return null;
    }

    try {
      const finalOptions = {
        format: options.format || exportSettings.format,
        quality: options.quality || exportSettings.quality,
        scale: options.scale || exportSettings.scale,
        includeWatermark:
          options.includeWatermark ?? exportSettings.includeWatermark,
        watermarkText: options.watermarkText || 'sora2video.online',
        watermarkPosition: options.watermarkPosition || 'bottom-right',
      };

      // Create a temporary canvas for adding watermark
      const originalDataURL = stage.toDataURL({
        mimeType: finalOptions.format === 'jpg' ? 'image/jpeg' : 'image/png',
        quality: finalOptions.quality,
        pixelRatio: finalOptions.scale,
      });

      if (!finalOptions.includeWatermark) {
        return originalDataURL;
      }

      // Add watermark
      return await addWatermark(originalDataURL, {
        text: finalOptions.watermarkText,
        position: finalOptions.watermarkPosition,
        canvasWidth: width * finalOptions.scale,
        canvasHeight: height * finalOptions.scale,
      });
    } catch (error) {
      console.error('Error exporting image:', error);
      return null;
    }
  };

  const downloadImage = async (
    stageRef: React.RefObject<any>,
    filename?: string,
    options: ExportOptions = {}
  ): Promise<boolean> => {
    try {
      const dataURL = await exportImage(stageRef, options);
      if (!dataURL) return false;

      const finalOptions = {
        format: options.format || exportSettings.format,
        ...options,
      };

      const link = document.createElement('a');
      link.download =
        filename || `sora2video-${Date.now()}.${finalOptions.format}`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return true;
    } catch (error) {
      console.error('Error downloading image:', error);
      return false;
    }
  };

  return {
    exportImage,
    downloadImage,
  };
}

interface WatermarkOptions {
  text: string;
  position:
    | 'bottom-right'
    | 'bottom-left'
    | 'top-right'
    | 'top-left'
    | 'center';
  canvasWidth: number;
  canvasHeight: number;
}

async function addWatermark(
  originalDataURL: string,
  options: WatermarkOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      canvas.width = options.canvasWidth;
      canvas.height = options.canvasHeight;

      // Draw original image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Set watermark style
      const fontSize = Math.max(12, canvas.width * 0.025); // Responsive font size
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 1;

      // Measure text
      const textMetrics = ctx.measureText(options.text);
      const textWidth = textMetrics.width;
      const textHeight = fontSize;

      // Calculate position
      let x: number;
      let y: number;
      const padding = 10;

      switch (options.position) {
        case 'bottom-right':
          x = canvas.width - textWidth - padding;
          y = canvas.height - padding;
          break;
        case 'bottom-left':
          x = padding;
          y = canvas.height - padding;
          break;
        case 'top-right':
          x = canvas.width - textWidth - padding;
          y = textHeight + padding;
          break;
        case 'top-left':
          x = padding;
          y = textHeight + padding;
          break;
        case 'center':
          x = (canvas.width - textWidth) / 2;
          y = canvas.height / 2;
          break;
        default:
          x = canvas.width - textWidth - padding;
          y = canvas.height - padding;
      }

      // Draw watermark with shadow effect
      ctx.strokeText(options.text, x, y);
      ctx.fillText(options.text, x, y);

      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for watermark'));
    };

    img.src = originalDataURL;
  });
}
