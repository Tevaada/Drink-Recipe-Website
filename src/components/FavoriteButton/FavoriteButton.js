"use client";

import { useEffect, useState } from "react";
import { isFavorite, toggleFavorite } from "@/services/favorites";
import {
    isMemberFavorite,
    toggleMemberFavorite,
} from "@/services/memberFavorites";
import styles from "./FavoriteButton.module.css";

export default function FavoriteButton({ recipe, unsavedLabel = "Save" }) {
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function synchronizeFavorite() {
            try {
                const memberStatus =
                    await isMemberFavorite(recipe.id);

                if (cancelled) {
                    return;
                }

                setSaved(
                    memberStatus.authenticated
                        ? memberStatus.saved
                        : isFavorite(recipe.id),
                );
            } catch (loadError) {
                if (!cancelled) {
                    setError(loadError.message);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        }

        synchronizeFavorite();

        window.addEventListener(
            "favoriteschange",
            synchronizeFavorite,
        );

        window.addEventListener(
            "storage",
            synchronizeFavorite,
        );

        return () => {
            cancelled = true;

            window.removeEventListener(
                "favoriteschange",
                synchronizeFavorite,
            );

            window.removeEventListener(
                "storage",
                synchronizeFavorite,
            );
        };
    }, [recipe.id]);

    async function handleClick() {
        try {
            setError("");
            setIsLoading(true);

            const memberResult =
                await toggleMemberFavorite(recipe);

            if (memberResult.authenticated) {
                setSaved(memberResult.saved);

                window.dispatchEvent(
                    new Event("favoriteschange"),
                );

                return;
            }

            const guestResult = toggleFavorite(recipe);

            setSaved(guestResult.saved);
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setIsLoading(false);
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
            disabled={isLoading}
            aria-pressed={saved}
            aria-label={
            saved
                ? `Remove ${recipe.title} from favorites`
                : `Save ${recipe.title} to favorites`
            }
        >
            {isLoading
                ? "Loading..."
                : saved
                    ? "Saved"
                    : unsavedLabel}
        </button>

        {error && (
            <span className={styles.error} role="alert">
            {error}
            </span>
        )}
        </div>
    );
}
