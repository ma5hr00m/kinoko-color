import React, { useState, useRef, useEffect, useCallback } from 'react';
import styles from './ImagePicker.module.scss';
import { toast } from '../../stores/toastStore';

interface ImagePickerProps {
  onColorPick?: (hex: string, rgba: string) => void;
  onImageUpload?: (url: string) => void;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({ 
  onColorPick, 
  onImageUpload 
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [color, setColor] = useState({ hex: '#000000', rgba: 'rgba(0,0,0,1)' });
  const [pickerPosition, setPickerPosition] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  const isPickingRef = useRef(false);
  const lastPickTime = useRef<number>(0);

  const getColorAtPosition = useCallback((x: number, y: number) => {
    if (!imageDataRef.current) return null;
    
    const index = (Math.round(y) * imageDataRef.current.width + Math.round(x)) * 4;
    const data = imageDataRef.current.data;
    
    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const a = data[index + 3];
    
    if (typeof r === 'undefined') return null;

    const rgba = `rgba(${r},${g},${b},${a / 255})`;
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    
    return { hex, rgba };
  }, []);

  const updatePickerPosition = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current || !isPickingRef.current || !canvasRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const canvas = canvasRef.current;
    
    const scaleX = canvas.width / canvas.offsetWidth;
    const scaleY = canvas.height / canvas.offsetHeight;
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    const boundedX = Math.min(Math.max(0, x), canvas.width - 1);
    const boundedY = Math.min(Math.max(0, y), canvas.height - 1);

    const now = performance.now();
    if (now - lastPickTime.current > 32) { 
      const newColor = getColorAtPosition(boundedX, boundedY);
      if (newColor) {
        setColor(newColor);
        onColorPick?.(newColor.hex, newColor.rgba);
      }
      lastPickTime.current = now;
    }

    setPickerPosition({
      x: (boundedX / scaleX),
      y: (boundedY / scaleY)
    });
  }, [getColorAtPosition, onColorPick]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    e.preventDefault();
    updatePickerPosition(e.clientX, e.clientY);
  }, [updatePickerPosition]);

  const handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    if (!isPickingRef.current || !e.touches[0]) return;
    updatePickerPosition(e.touches[0].clientX, e.touches[0].clientY);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
      if (validTypes.includes(file.type)) {
        const url = URL.createObjectURL(file);
        setImageUrl(url);
        onImageUpload?.(url);
        toast.success(
          'Image Uploaded',
          `Successfully loaded ${file.name}`
        );
      } else {
        toast.error(
          'Invalid File Type',
          'Please upload a valid image file (JPG, PNG, SVG, or WebP)'
        );
      }
    }
  };

  useEffect(() => {
    if (imageUrl) {
      const image = new Image();
      image.src = imageUrl;
      
      image.onload = () => {
        if (canvasRef.current && containerRef.current) {
          const canvas = canvasRef.current;
          const maxHeight = 400;
          const maxWidth = 1200;

          let scale = 1;
          if (image.height > maxHeight || image.width > maxWidth) {
            scale = Math.min(
              maxWidth / image.width,
              maxHeight / image.height
            );
          }

          const targetWidth = Math.round(image.width * scale);
          const targetHeight = Math.round(image.height * scale);
          
          canvas.width = image.width;
          canvas.height = image.height;
          
          canvas.style.width = `${targetWidth}px`;
          canvas.style.height = `${targetHeight}px`;
          
          containerRef.current.style.width = `${targetWidth}px`;
          containerRef.current.style.height = `${targetHeight}px`;
          
          ctx.current = canvas.getContext('2d', {
            alpha: false,
            willReadFrequently: true
          });
          
          if (ctx.current) {
            ctx.current.imageSmoothingEnabled = true;
            ctx.current.imageSmoothingQuality = 'high';
            ctx.current.drawImage(image, 0, 0);
            
            imageDataRef.current = ctx.current.getImageData(0, 0, canvas.width, canvas.height);
          }
        }
      };

      return () => {
        URL.revokeObjectURL(imageUrl);
        imageDataRef.current = null;
      };
    }
  }, [imageUrl]);

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isPickingRef.current = true;

    const handleInteractionEnd = () => {
      isPickingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove as EventListener);
      document.removeEventListener('mouseup', handleInteractionEnd);
      document.removeEventListener('touchend', handleInteractionEnd);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false } as AddEventListenerOptions);
    document.addEventListener('mouseup', handleInteractionEnd);
    document.addEventListener('touchend', handleInteractionEnd);

    if (e instanceof MouseEvent) {
      updatePickerPosition(e.clientX, e.clientY);
    } else if ('touches' in e && e.touches[0]) {
      updatePickerPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <div className={styles.imagePicker}>
      <div className={styles.uploadSection}>
        <label htmlFor="image-upload" className={styles.fileInputLabel}>
          Choose Image
        </label>
        <input
          id="image-upload"
          type="file"
          accept=".jpg,.jpeg,.png,.svg,.webp"
          onChange={handleImageUpload}
          className={styles.fileInput}
        />
      </div>
      
      {imageUrl ? (
        <div 
          ref={containerRef}
          className={`${styles.imageContainer} ${styles.hasImage}`}
          onMouseDown={handleInteractionStart}
          onTouchStart={handleInteractionStart}
        >
          <canvas ref={canvasRef} className={styles.canvas} />
          <div 
            className={styles.colorPicker} 
            style={{ 
              left: `${pickerPosition.x}px`, 
              top: `${pickerPosition.y}px`,
              backgroundColor: color.rgba 
            }} 
          />
        </div>
      ) : (
        <label 
          htmlFor="image-upload" 
          className={`${styles.imageContainer} ${styles.placeholder}`}
        >
          <svg 
            width="48" 
            height="48" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#666"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" />
            <line x1="16" y1="5" x2="22" y2="5" />
            <line x1="19" y1="2" x2="19" y2="8" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
          </svg>
          <span>Click to upload an image</span>
        </label>
      )}
    </div>
  );
};

export default ImagePicker;
