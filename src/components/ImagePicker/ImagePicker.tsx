import React, { useState, useRef, useEffect } from 'react';
import styles from './ImagePicker.module.scss';

interface ImagePickerProps {
  onColorPick?: (hex: string, rgba: string) => void;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({ onColorPick }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [color, setColor] = useState({ hex: '#000000', rgba: 'rgba(0,0,0,1)' });
  const [pickerPosition, setPickerPosition] = useState({ x: 0, y: 0 });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const ctx = useRef<CanvasRenderingContext2D | null>(null);
  const isPickingRef = useRef(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'];
      if (validTypes.includes(file.type)) {
        const url = URL.createObjectURL(file);
        setImageUrl(url);
      } else {
        alert('Please upload a valid image file (JPG, PNG, SVG, or WebP)');
      }
    }
  };

  useEffect(() => {
    if (imageUrl) {
      const image = new Image();
      image.src = imageUrl;
      image.onload = () => {
        imageRef.current = image;
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = image.width;
          canvas.height = image.height;
          
          ctx.current = canvas.getContext('2d', { 
            alpha: false,
            willReadFrequently: true 
          });
          
          if (ctx.current) {
            ctx.current.imageSmoothingEnabled = true;
            ctx.current.imageSmoothingQuality = 'high';
            ctx.current.drawImage(image, 0, 0);
          }
        }
      };
    }
  }, [imageUrl]);

  const getColorAtPosition = (x: number, y: number) => {
    if (!ctx.current || !containerRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 计算实际的canvas坐标
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const canvasX = Math.floor(x * scaleX);
    const canvasY = Math.floor(y * scaleY);
    
    // 确保坐标在canvas范围内
    if (canvasX < 0 || canvasX >= canvas.width || canvasY < 0 || canvasY >= canvas.height) return;
    
    const pixel = ctx.current.getImageData(canvasX, canvasY, 1, 1).data;
    const [r, g, b] = pixel;
    const rgba = `rgba(${r},${g},${b},1)`;
    const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    
    setColor({ hex, rgba });
    onColorPick?.(hex, rgba);
    return { hex, rgba };
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPickingRef.current) return;
    
    if ('touches' in e) {
      e.preventDefault();
    }
    
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setPickerPosition({ x, y });
    getColorAtPosition(x, y);
  };

  const handleInteractionStart = (e: React.MouseEvent | React.TouchEvent) => {
    isPickingRef.current = true;
    handleInteraction(e);

    const handleInteractionEnd = () => {
      isPickingRef.current = false;
      document.removeEventListener('mousemove', handleInteraction as unknown as (e: MouseEvent) => void);
      document.removeEventListener('touchmove', handleInteraction as unknown as (e: TouchEvent) => void);
      document.removeEventListener('mouseup', handleInteractionEnd);
      document.removeEventListener('touchend', handleInteractionEnd);
    };

    document.addEventListener('mousemove', handleInteraction as unknown as (e: MouseEvent) => void);
    document.addEventListener('touchmove', handleInteraction as unknown as (e: TouchEvent) => void);
    document.addEventListener('mouseup', handleInteractionEnd);
    document.addEventListener('touchend', handleInteractionEnd);
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
      
      {imageUrl && (
        <div 
          ref={containerRef}
          className={styles.imageContainer}
          onMouseDown={handleInteractionStart}
          onTouchStart={handleInteractionStart}
        >
          <canvas ref={canvasRef} className={styles.canvas} />
          <div 
            className={styles.focusPoint}
            style={{
              left: `${pickerPosition.x}px`,
              top: `${pickerPosition.y}px`,
              backgroundColor: color.hex
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImagePicker;
