import React from 'react';
import ImagePicker from '../ImagePicker/ImagePicker';
import ColorDisplay from '../ColorDisplay/ColorDisplay';
import styles from './ImageContent.module.scss';

interface ImageContentProps {
  currentColor: {
    hex: string;
    rgba: string;
  };
  onColorPick: (hex: string, rgba: string) => void;
  imageUrl: string | null;
}

export const ImageContent: React.FC<ImageContentProps> = ({ 
  currentColor, 
  onColorPick,
  imageUrl 
}) => {
  return (
    <div className={styles.content}>
      <ImagePicker 
        onColorPick={onColorPick}
        initialImageUrl={imageUrl || undefined}
      />
      <ColorDisplay color={currentColor} />
    </div>
  );
};

export default ImageContent;
