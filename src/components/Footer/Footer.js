import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <section className={styles.brandSection}>
                    <Link href="/" className={styles.brand}>
                        <span className={styles.brandMark}>
                        LM
                        </span>

                        <span>
                        <strong>Drink Recipe</strong>
                        <small>Kinetic wellness</small>
                        </span>
                    </Link>

                    <p>
                        Discover drinks, understand their ingredients,
                        and save recipes for later.
                    </p>
                </section>

                <nav className={styles.linkSection} aria-label="Footer navigation">
                    <h2>Explore</h2>

                    <Link href="/">Home</Link>
                    <Link href="/recipes">Formulations</Link>
                    <Link href="/favorites">The Vault</Link>
                    <Link href="/about">The Vision</Link>
                </nav>

                <section className={styles.locationSection}>
                    <h2>Location</h2>

                    <p>Phnom Penh, Cambodia</p>

                    <Link href="/recipes" className={styles.actionLink}>
                        Discover recipes
                        <span aria-hidden="true">→</span>
                    </Link>
                </section>
            </div>

            <div className={styles.bottom}>
                <p>
                © {currentYear} Drink Recipe. All rights reserved.
                </p>

                <p>Built with Next.js and TheCocktailDB.</p>
            </div>
        </footer>
    );
}