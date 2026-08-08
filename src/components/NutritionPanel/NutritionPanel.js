"use client";

import { useState } from "react";
import styles from "./NutritionPanel.module.css";

export default function NutritionPanel({ drinkName }) {
    const [nutrition, setNutrition] = useState(null);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleNutrition() {
        if (hasLoaded) {
            setIsVisible((current) => !current);
            return;
        }

        try {
            setError("");
            setIsLoading(true);

            const response = await fetch(
                `/api/nutrition?q=${encodeURIComponent(
                    drinkName,
                )}`,
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    "Unable to load nutrition.",
                );
            }

            setNutrition(data.nutrition);
            setHasLoaded(true);
            setIsVisible(true);
        } catch (requestError) {
            setError(requestError.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section
            className={styles.panel}
            aria-labelledby="nutrition-title"
        >
            <div className={styles.heading}>
                <div>
                    <h2 id="nutrition-title">
                        Nutrition estimate
                    </h2>

                    <p>
                        Find the closest USDA match for
                        this drink.
                    </p>
                </div>

                <button
                    type="button"
                    className={styles.button}
                    onClick={handleNutrition}
                    disabled={isLoading}
                >
                    {isLoading
                        ? "Checking..."
                        : isVisible
                          ? "Hide nutrition"
                          : hasLoaded
                            ? "Show nutrition"
                            : "Check USDA nutrition"}
                </button>
            </div>

            {error && (
                <p className={styles.error} role="alert">
                    {error}
                </p>
            )}

            {hasLoaded && isVisible && (
                nutrition ? (
                    <div className={styles.result}>
                        <p>
                            <strong>Closest match:</strong>{" "}
                            {nutrition.matchedFood}
                        </p>

                        <div className={styles.grid}>
                            <span>
                                Calories
                                <strong>
                                    {nutrition.calories}
                                </strong>
                            </span>

                            <span>
                                Carbs
                                <strong>
                                    {nutrition.carbohydrates}
                                </strong>
                            </span>

                            <span>
                                Sugar
                                <strong>
                                    {nutrition.sugar}
                                </strong>
                            </span>

                            <span>
                                Protein
                                <strong>
                                    {nutrition.protein}
                                </strong>
                            </span>
                        </div>

                        <small>
                            {nutrition.servingNote}. This is
                            not an exact recipe total.
                        </small>
                    </div>
                ) : (
                    <p className={styles.empty}>
                        No USDA match was found for this drink.
                    </p>
                )
            )}
        </section>
    );
}