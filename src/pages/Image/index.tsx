import React, { useState, useEffect, memo, lazy, Suspense } from 'react';
import styles from './Image.module.scss';

// 懒加载组件
const ImagePicker = lazy(() => import('../../components/ImagePicker/ImagePicker'));
const ImageContent = lazy(() => import('../../components/ImageContent/ImageContent'));

// 使用memo包装loading组件以避免不必要的重渲染
const LoadingFallback = memo(() => (
  <div className={styles.loadingContainer}>
    <div className={styles.loadingSpinner} />
  </div>
));

const LOCAL_STORAGE_KEY = 'kinoko_last_image';
const STORAGE_EXPIRY_KEY = 'kinoko_image_expiry';
const EXPIRY_TIME = 60 * 60 * 1000; // 1 hour in milliseconds

export const Image: React.FC = () => {
  const [currentColor, setCurrentColor] = useState({ hex: '#000000', rgba: 'rgba(0,0,0,1)' });
  const [hasImage, setHasImage] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved image on component mount
    const savedImage = localStorage.getItem(LOCAL_STORAGE_KEY);
    const expiryTime = localStorage.getItem(STORAGE_EXPIRY_KEY);
    
    if (savedImage && expiryTime) {
      const now = new Date().getTime();
      if (now < parseInt(expiryTime)) {
        setImageUrl(savedImage);
        setHasImage(true);
      } else {
        // Clear expired image
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(STORAGE_EXPIRY_KEY);
      }
    }
  }, []);

  const handleColorPick = (hex: string, rgba: string) => {
    setCurrentColor({ hex, rgba });
  };

  const handleImageUpload = (url: string) => {
    setImageUrl(url);
    setHasImage(true);
    // Save image to localStorage with expiry time
    const expiryTime = new Date().getTime() + EXPIRY_TIME;
    localStorage.setItem(LOCAL_STORAGE_KEY, url);
    localStorage.setItem(STORAGE_EXPIRY_KEY, expiryTime.toString());
  };

  return (
    <div className={styles.imagePage}>
      <hgroup>
        <h2>IMAGE COLOR</h2>
        <p>Upload an image and click anywhere to extract colors</p>
      </hgroup>
      <Suspense fallback={<LoadingFallback />}>
        {!hasImage ? (
          <div className={styles.uploadSection}>
            <ImagePicker 
              onColorPick={handleColorPick}
              onImageUpload={handleImageUpload}
            />
          </div>
        ) : (
          <ImageContent 
            imageUrl={imageUrl!}
            currentColor={currentColor}
            onColorPick={handleColorPick}
          />
        )}
      </Suspense>
    </div>
  );
};
