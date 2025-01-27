import React from 'react';
import styles from './Palette.module.scss';

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
  const getContrastColor = (hexColor: string): string => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  return (
    <div className={styles.paletteContainer}>
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
                  color: getContrastColor(colorValue)
                }}
                title={colorValue}
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