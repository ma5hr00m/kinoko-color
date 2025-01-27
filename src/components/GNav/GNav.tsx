import { NavLink } from 'react-router-dom';
import styles from './GNav.module.scss';
import { CircumPickerHalf, MaterialSymbolsLightHomeOutline, MaterialSymbolsLightImageOutline, MaterialSymbolsLightPaletteOutline, WeuiLikeOutlined } from '../Icons/Icons';

export function GNav() {
  return (
    <nav className={styles.nav}>
      <ul>
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>
            <MaterialSymbolsLightHomeOutline />
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/palette" className={({ isActive }) => isActive ? styles.active : ''}>
            <MaterialSymbolsLightPaletteOutline />
            Palette
          </NavLink>
        </li>
        <li>
          <NavLink to="/picker" className={({ isActive }) => isActive ? styles.active : ''}>
            <CircumPickerHalf />
            Picker
          </NavLink>
        </li>
        <li>
          <NavLink to="/image" className={({ isActive }) => isActive ? styles.active : ''}>
            <MaterialSymbolsLightImageOutline />
            Image
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => isActive ? styles.active : ''}>
            <WeuiLikeOutlined />
            About
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
