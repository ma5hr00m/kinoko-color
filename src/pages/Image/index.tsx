import React, { useState } from 'react';
import ImagePicker from '../../components/ImagePicker/ImagePicker';
import styles from './Image.module.scss';

export const Image: React.FC = () => {
  const [currentColor, setCurrentColor] = useState({ hex: '#000000', rgba: 'rgba(0,0,0,1)' });

  const handleColorPick = (hex: string, rgba: string) => {
    setCurrentColor({ hex, rgba });
  };

  return (
    <div className={styles.imagePage}>
      <h1>Image Color Picker</h1>
      <div className={styles.content}>
        <ImagePicker onColorPick={handleColorPick} />
        <div className={styles.colorDisplay}>
          <div 
            className={styles.colorBox}
            style={{ backgroundColor: currentColor.hex }}
          />
          <div className={styles.colorInfo}>
            <div>HEX: {currentColor.hex}</div>
            <div>RGBA: {currentColor.rgba}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

