"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RecipeCard from "@/components/RecipeCard/RecipeCard";
import { getFavorites } from "@/services/favorites";
import { getMemberFavorites } from "@/services/memberFavorites";
import styles from "./FavoritesContent.module.css";

export default function FavoritesContent() {
    const [favorites, setFavorites] = useState([]);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function synchronizeFavorites() {
            try {
                setError("");

                const memberResult =
                    await getMemberFavorites();

                if (cancelled) {
                    return;
                }

                const nextFavorites =
                    memberResult.authenticated
                        ? memberResult.favorites
                        : getFavorites();

                setFavorites(nextFavorites);
            } catch (loadError) {
                if (!cancelled) {
                    setError(loadError.message);
                }
            } finally {
                if (!cancelled) {
                    setHasLoaded(true);
                }
            }
        }

        synchronizeFavorites();

        window.addEventListener(
            "favoriteschange",
            synchronizeFavorites,
        );

        window.addEventListener(
            "storage",
            synchronizeFavorites,
        );

        return () => {
            cancelled = true;

            window.removeEventListener(
                "favoriteschange",
                synchronizeFavorites,
            );

            window.removeEventListener(
                "storage",
                synchronizeFavorites,
            );
        };
    }, []);

    if (!hasLoaded) {
        return (
            <div className={styles.status} role="status">
                Loading favorites...
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.status} role="alert">
                {error}
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <section className={styles.empty}>
                <span className={styles.emptyIcon}>
                    ♡
                </span>

                <h2>No favorites yet</h2>

                <p>
                    Save a drink recipe and it will appear here.
                </p>

                <Link href="/recipes" className={styles.browseButton}>
                    Browse recipes
                </Link>
            </section>
        );
    }

    return (
        <section className={styles.favoritesSection} aria-labelledby="saved-recipes-title">
        <div className={styles.sectionHeading}>
            <h2 id="saved-recipes-title" className={styles.sectionTitle}>
                Saved recipes
            </h2>

            <span className={styles.recipeCount}>
                {favorites.length} saved
            </span>
        </div>

        <div className={styles.recipeGrid}>
            {favorites.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe}/>
            ))}
        </div>
        </section>
    );
}
