interface ImageConfig {
  maxWidth: number;
  maxHeight: number;
  quality: number;
}

const DEFAULT_CONFIG: ImageConfig = {
  maxWidth: 400,
  maxHeight: 400,
  quality: 0.8
};

export const optimizeImage = (file: File, config: Partial<ImageConfig> = {}): Promise<File> => {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        // Calculate new dimensions
        if (width > finalConfig.maxWidth) {
          height = (height * finalConfig.maxWidth) / width;
          width = finalConfig.maxWidth;
        }
        if (height > finalConfig.maxHeight) {
          width = (width * finalConfig.maxHeight) / height;
          height = finalConfig.maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create blob'));
              return;
            }
            // Create new file with original name but optimized content
            const optimizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          },
          'image/jpeg',
          finalConfig.quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};
