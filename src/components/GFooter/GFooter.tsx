import React from 'react';
import styles from './GFooter.module.scss';

export const GFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.info}>
          <p className={styles.copyright}>
            {currentYear} Kinoko Color. All rights reserved.
          </p>
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.icp}
          >
            浙ICP备2023028448号-2
          </a>
        </div>
      </div>
    </div>
  );
};

export default GFooter;
