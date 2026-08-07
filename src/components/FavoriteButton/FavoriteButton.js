"use client";

import { useEffect, useState } from "react";
import { isFavorite, toggleFavorite,} from "@/services/favorites";
import styles from "./FavoriteButton.module.css";

export default function FavoriteButton({recipe, unsavedLabel = "Save",}) {
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        function synchronizeFavorite() {
            setSaved(isFavorite(recipe.id));
        }

        synchronizeFavorite();

        window.addEventListener("favoriteschange", synchronizeFavorite,);

        window.addEventListener("storage", synchronizeFavorite,);

        return () => {
        window.removeEventListener( "favoriteschange", synchronizeFavorite,);

        window.removeEventListener( "storage", synchronizeFavorite,);};
    }, [recipe.id]);

    function handleClick() {
        try {
        setError("");

        const result = toggleFavorite(recipe);

        setSaved(result.saved);
        } catch (saveError) {
        setError(saveError.message);
        }
    }

    return (
        <div className={styles.wrapper}>
        <button
            type="button"
            className={`${styles.button} ${
            saved ? styles.saved : ""
            }`}
            onClick={handleClick}
            aria-pressed={saved}
            aria-label={
            saved
                ? `Remove ${recipe.title} from favorites`
                : `Save ${recipe.title} to favorites`
            }
        >
            {saved ? "Saved" : unsavedLabel}
        </button>

        {error && (
            <span className={styles.error} role="alert">
            {error}
            </span>
        )}
        </div>
    );
}