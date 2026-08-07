import Image from "next/image";
import Link from "next/link";
import styles from "./RecipeCard.module.css";
import FavoriteButton from "@/components/FavoriteButton/FavoriteButton";


export default function RecipeCard({ recipe }) {
    const drinkType = recipe.alcoholic || recipe.intensity || "Drink";
    const drinkMeta = recipe.glass || recipe.prepTime || "Recipe";
    return (
        <article className={styles.card}>
        <Link
            href={`/recipes/${recipe.id}`}
            className={styles.imageLink}
        >
            <Image
            className={styles.image}
            src={recipe.image}
            alt={recipe.title}
            width={600}
            height={450}
            />
        </Link>

        <div className={styles.content}>
            <div className={styles.topline}>
            <span className={styles.category}>
                {recipe.category}
            </span>

            <span className={styles.intensity}>
                {drinkType}
            </span>
            </div>

            <h3 className={styles.title}>
            <Link href={`/recipes/${recipe.id}`}>
                {recipe.title}
            </Link>
            </h3>

            <p className={styles.description}>
                {recipe.description}
            </p>

            <div className={styles.actions}>
            <span className={styles.prepTime}>
                {drinkMeta}
            </span>

            <FavoriteButton recipe={recipe} />
            </div>
        </div>
        </article>
    );
}