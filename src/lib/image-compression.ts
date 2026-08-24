/**
 * Client-side image compression and optimization utility.
 */

export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0 to 1 (default: 0.82)
  targetFormat?: "image/webp" | "image/jpeg" | "image/png";
}

/**
 * Compress an image file in the browser using HTML Canvas.
 * Reduces resolution if needed and encodes as modern WebP / JPEG.
 */
export async function compressImage(
  file: File,
  options: ImageCompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.82,
    targetFormat = "image/webp",
  } = options;

  // If it's not an image or is an animated gif, return original
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio-preserved bounding box
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(file);
        }

        // Use high quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // If compressed blob is somehow larger or failed, return original
              return resolve(file);
            }

            const ext = targetFormat === "image/webp" ? ".webp" : targetFormat === "image/jpeg" ? ".jpg" : ".png";
            const originalNameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
            const newFileName = `${originalNameWithoutExt}${ext}`;

            const compressedFile = new File([blob], newFileName, {
              type: targetFormat,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          targetFormat,
          quality
        );
      };

      img.onerror = () => {
        resolve(file);
      };
    };

    reader.onerror = () => {
      resolve(file);
    };
  });
}
