import React from 'react';
import styles from './FormatSelector.module.scss';

export type ColorFormat = 'hex' | 'rgba';

interface FormatSelectorProps {
  colorFormat: ColorFormat;
  onFormatChange: (format: ColorFormat) => void;
}

export const FormatSelector: React.FC<FormatSelectorProps> = ({
  colorFormat,
  onFormatChange,
}) => {
  return (
    <div className={styles.formatSelector}>
      <button
        className={`${styles.formatButton} ${colorFormat === 'hex' ? styles.active : ''}`}
        onClick={() => onFormatChange('hex')}
      >
        HEX
      </button>
      <button
        className={`${styles.formatButton} ${colorFormat === 'rgba' ? styles.active : ''}`}
        onClick={() => onFormatChange('rgba')}
      >
        RGBA
      </button>
    </div>
  );
};

export default FormatSelector;
