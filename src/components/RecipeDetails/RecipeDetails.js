import Image from "next/image";
import styles from "./RecipeDetails.module.css";
import FavoriteButton from "@/components/FavoriteButton/FavoriteButton";
import NutritionPanel from "@/components/NutritionPanel/NutritionPanel";
import PreparationTimer from "@/components/PreparationTimer/PreparationTimer";

export default function RecipeDetails({ drink }) {
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

                <PreparationTimer />

                <NutritionPanel drinkName={drink.title} />
            </div>
        </article>
    );
}
