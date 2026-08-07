"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getDrinkById } from "@/services/drinks";
import styles from "./RecipeDetails.module.css";
import FavoriteButton from "@/components/FavoriteButton/FavoriteButton";

export default function RecipeDetails({ id }) {
    const [drink, setDrink] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        async function loadDrink() {
        try {
            setIsLoading(true);
            setError("");

            const result = await getDrinkById(id);

            if (!ignore) {
            setDrink(result);
            }
        } catch (requestError) {
            if (!ignore) {
            setError(requestError.message);
            }
        } finally {
            if (!ignore) {
            setIsLoading(false);
            }
        }
        }

        loadDrink();

        return () => {
        ignore = true;
        };
    }, [id]);

    if (isLoading) {
        return (
        <div className={styles.status} role="status">
            Loading recipe details...
        </div>
        );
    }

    if (error) {
        return (
        <div className={styles.error} role="alert">
            <h1>Unable to load recipe</h1>
            <p>{error}</p>
        </div>
        );
    }

    if (!drink) {
        return (
        <div className={styles.status}>
            Recipe not found.
        </div>
        );
    }

    return (
        <article className={styles.details}>
            <div className={styles.imageWrapper}>
                {drink.image ? (
                <Image
                    className={styles.image}
                    src={drink.image}
                    alt={drink.title}
                    width={900}
                    height={700}
                    priority
                />
                ) : (
                <div className={styles.imageFallback}>
                    Image unavailable
                </div>
                )}
            </div>

            <div className={styles.content}>
                <span className={styles.eyebrow}>
                {drink.category}
                </span>

                <h1 className={styles.title}>
                {drink.title}
                </h1>

                <div className={styles.meta}>
                <span>{drink.alcoholic}</span>
                <span>{drink.glass}</span>
                </div>

                <div className={styles.favoriteAction}>
                    <FavoriteButton
                        recipe={drink}
                        unsavedLabel="Save recipe"
                    />
                </div>

                <section
                className={styles.section}
                aria-labelledby="ingredients-title"
                >
                <h2 id="ingredients-title">
                    Ingredients
                </h2>

                <ul className={styles.ingredients}>
                    {drink.ingredients.map(
                    (ingredient, index) => (
                        <li
                        key={`${ingredient.name}-${index}`}
                        >
                        <span>{ingredient.name}</span>
                        <strong>{ingredient.amount}</strong>
                        </li>
                    ),
                    )}
                </ul>
                </section>

                <section
                className={styles.section}
                aria-labelledby="instructions-title"
                >
                <h2 id="instructions-title">
                    Instructions
                </h2>

                <p className={styles.instructions}>
                    {drink.instructions}
                </p>
                </section>
            </div>
        </article>
    );
}