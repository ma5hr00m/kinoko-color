import React from 'react';
import { ColorWheel } from '../../components/ColorWheel/ColorWheel';
import styles from './Picker.module.scss';

export const Picker: React.FC = () => {
  return (
    <div className={styles.pickerPage}>
      <hgroup>
        <h2>COLOR WHEEL</h2>
        <p>Pick colors from an interactive color wheel with real-time preview</p>
      </hgroup>
      <ColorWheel />
    </div>
  );
};
