import React, { useState } from 'react';
import styles from './Palette.module.scss';
import { toast } from '../../stores/toastStore';
import FormatSelector, { ColorFormat } from '../../components/FormatSelector/FormatSelector';

interface ColorInfo {
  [key: string]: string;
}

interface PaletteItem {
  title: string;
  description: string;
  colors: ColorInfo;
}

interface PaletteProps {
  palettes: PaletteItem[];
}

export const Palette: React.FC<PaletteProps> = ({ palettes }) => {
  const [colorFormat, setColorFormat] = useState<ColorFormat>('hex');

  const getContrastColor = (hexColor: string): string => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  const hexToRgba = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 1)`;
  };

  const handleColorCopy = (colorValue: string, colorName: string) => {
    const valueToCopy = colorFormat === 'hex' ? colorValue : hexToRgba(colorValue);
    navigator.clipboard.writeText(valueToCopy).then(() => {
      toast.success(
        'Color Copied!',
        `${colorName} (${valueToCopy}) has been copied to clipboard`
      );
    }).catch(() => {
      toast.error(
        'Copy Failed',
        'Failed to copy color to clipboard. Please try again.'
      );
    });
  };

  return (
    <div className={styles.paletteContainer}>
      <FormatSelector colorFormat={colorFormat} onFormatChange={setColorFormat} />

      {palettes.map((palette, index) => (
        <div key={index} className={styles.paletteCard}>
          <hgroup>
            <h2>{palette.title}</h2>
            <p>{palette.description}</p>
          </hgroup>
          <ul className={styles.colorGrid}>
            {Object.entries(palette.colors).map(([colorName, colorValue]) => (
              <li
                key={colorName}
                className={styles.colorItem}
                style={{
                  backgroundColor: colorValue,
                  color: getContrastColor(colorValue),
                  cursor: 'pointer'
                }}
                title={colorFormat === 'hex' ? colorValue : hexToRgba(colorValue)}
                onClick={() => handleColorCopy(colorValue, colorName)}
              >
                {colorName}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
