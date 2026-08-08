"use client";

import Link from "next/link";
import styles from "./error.module.css";

export default function RecipeError({ reset }) {
    return (
        <main className={styles.page}>
            <div className={styles.content}>
                <span className={styles.eyebrow}>
                    Recipe unavailable
                </span>

                <h1>We couldn’t load this recipe</h1>

                <p>
                    The drink service may be temporarily
                    unavailable. Please try again.
                </p>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.retryButton}
                        onClick={reset}
                    >
                        Try again
                    </button>

                    <Link
                        href="/recipes"
                        className={styles.recipesLink}
                    >
                        Browse recipes
                    </Link>
                </div>
            </div>
        </main>
    );
}