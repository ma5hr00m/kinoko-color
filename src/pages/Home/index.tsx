import styles from './Home.module.scss';

export function Home() {
  return (
    <div className={styles.homePage}>
      <div className={styles.hero}>
        <h1>Welcome to Kinoko Color</h1>
        <p>
          A modern and intuitive color palette tool that helps you create, 
          explore, and manage beautiful color schemes for your projects.
        </p>
        <div className={styles.features}>
          <div className={styles.feature}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            <h3>Easy to Use</h3>
            <p>Simple and intuitive interface for effortless color selection</p>
          </div>
          <div className={styles.feature}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
            </svg>
            <h3>Advanced Features</h3>
            <p>Powerful tools for creating perfect color combinations</p>
          </div>
          <div className={styles.feature}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <path d="m2 12 20 0"></path>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <h3>Cross Platform</h3>
            <p>Works seamlessly across all modern browsers and devices</p>
          </div>
        </div>
      </div>
    </div>
  );
}
