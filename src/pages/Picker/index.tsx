import React from 'react';
import { ColorWheel } from '../../components/ColorWheel/ColorWheel';
import styles from './Picker.module.scss';

export const Picker: React.FC = () => {
  return (
    <div className={styles.pickerPage}>
      <h1>Color Picker</h1>
      <ColorWheel />
    </div>
  );
};
