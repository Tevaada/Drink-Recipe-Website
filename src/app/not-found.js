import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
    return (
        <div className={styles.page}>
            <div className={styles.content}>
                <span className={styles.code}>
                    404
                </span>

                <h1>Recipe not found</h1>

                <p>
                    The drink recipe or page you requested
                    could not be found.
                </p>

                <div className={styles.actions}>
                    <Link
                        href="/recipes"
                        className={styles.primaryLink}
                    >
                        Browse recipes
                    </Link>

                    <Link
                        href="/"
                        className={styles.secondaryLink}
                    >
                        Return home
                    </Link>
                </div>
            </div>
        </div>
    );
}
