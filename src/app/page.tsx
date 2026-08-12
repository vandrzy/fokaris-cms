import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.backgroundGlow} />
      <div className={styles.backgroundGlow2} />
      
      <div className={styles.container}>
        <h1 className={styles.title}>Welcome to Fokaris CMS</h1>
        <p className={styles.subtitle}>
          The next-generation content management system. Beautifully crafted, highly performant, and incredibly dynamic.
        </p>

        <div className={styles.buttonContainer}>
          <button className={styles.primaryButton}>Get Started</button>
          <button className={styles.secondaryButton}>View Documentation</button>
        </div>
        
        <div className={styles.glassCard}>
          <div className={styles.feature}>
            <div className={styles.icon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Lightning Fast</h3>
            <p className={styles.featureText}>Built on Next.js App Router for optimal performance and SEO out of the box.</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.icon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>E-Commerce Ready</h3>
            <p className={styles.featureText}>Seamlessly manage your products, orders, and content in one beautiful dashboard.</p>
          </div>
          <div className={styles.feature}>
            <div className={styles.icon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Modern Design</h3>
            <p className={styles.featureText}>Aesthetic and dynamic UI components that make content management a joy.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
