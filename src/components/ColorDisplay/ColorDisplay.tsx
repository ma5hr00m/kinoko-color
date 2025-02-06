import React from 'react';
import styles from './ColorDisplay.module.scss';
import { toast } from '../../stores/toastStore';

interface ColorDisplayProps {
  color: {
    hex: string;
    rgba: string;
  };
}

export const ColorDisplay: React.FC<ColorDisplayProps> = ({ color }) => {
  const handleCopyColor = async (type: 'hex' | 'rgba') => {
    const value = type === 'hex' ? color.hex : color.rgba;
    try {
      await navigator.clipboard.writeText(value);
      toast.success(
        'Color Copied!',
        `${value} has been copied to clipboard`
      );
    } catch {
      toast.error(
        'Copy Failed',
        'Failed to copy color to clipboard. Please try again.'
      );
    }
  };

  return (
    <div className={styles.colorDisplay}>
      <div 
        className={styles.colorBox}
        style={{ backgroundColor: color.hex }}
      />
      <div className={styles.colorInfo}>
        <div 
          className={styles.colorValue} 
          onClick={() => handleCopyColor('hex')}
          title="Click to copy HEX value"
        >
          HEX: {color.hex}
        </div>
        <div 
          className={styles.colorValue}
          onClick={() => handleCopyColor('rgba')}
          title="Click to copy RGBA value"
        >
          RGBA: {color.rgba}
        </div>
      </div>
    </div>
  );
};

export default ColorDisplay;
