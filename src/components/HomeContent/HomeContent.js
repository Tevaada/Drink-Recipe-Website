"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HeroCarousel from "@/components/HeroCarousel/HeroCarousel";
import RecipeCard from "@/components/RecipeCard/RecipeCard";
import { searchDrinks } from "@/services/drinks";
import styles from "./HomeContent.module.css";

export default function HomeContent() {
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        async function loadHomeRecipes() {
            try {
                setIsLoading(true);
                setError("");

                const drinks = await searchDrinks();

                if (!ignore) {
                setRecipes(drinks);
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

        loadHomeRecipes();

        return () => {
            ignore = true;
        };
    }, []);

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.status} role="status">
                Loading featured drinks...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.page}>
                <div className={styles.error} role="alert">
                <h1>Unable to load drinks</h1>
                <p>{error}</p>
                </div>
            </div>
        );
    }

    const categories = [
        ...new Set(
        recipes
            .map((recipe) => recipe.category)
            .filter(Boolean),
        ),
    ];

    return (
        <div className={styles.page}>
            <HeroCarousel recipes={recipes} />

            <div className={styles.categorySections}>
                {categories.map((category) => {
                const categoryRecipes = recipes
                    .filter(
                    (recipe) => recipe.category === category,
                    )
                    .slice(0, 3);

                const categoryId = category
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-");

                return (
                    <section
                        key={category}
                        className={styles.categorySection}
                        aria-labelledby={`category-${categoryId}`}
                        >
                        <div className={styles.sectionHeading}>
                            <div>
                            <span className={styles.eyebrow}>
                                Recipe category
                            </span>

                            <h2
                                id={`category-${categoryId}`}
                                className={styles.sectionTitle}
                            >
                                {category}
                            </h2>
                            </div>

                            <Link
                            href={`/recipes?category=${encodeURIComponent(category)}`}
                            className={styles.viewAllLink}
                            >
                            View all {category} recipes{" "}
                            <span aria-hidden="true">→</span>
                            </Link>
                        </div>

                        <div className={styles.recipeGrid}>
                            {categoryRecipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                            />
                            ))}
                        </div>
                    </section>
                );
                })}
            </div>
        </div>
    );
}