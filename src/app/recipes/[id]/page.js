import Link from "next/link";
import RecipeDetails from "@/components/RecipeDetails/RecipeDetails";
import styles from "./page.module.css";

export const metadata = {
    title: "Recipe Details | Drink Recipe",
    description: "View ingredients and preparation instructions for this drink recipe.",
};

export default async function RecipePage({ params }) {
    const { id } = await params;

    return (
        <div className={styles.page}>
        <Link
            href="/recipes"
            className={styles.backLink}
        >
            <span aria-hidden="true">←</span>
            Back to recipes
        </Link>

        <RecipeDetails id={id} />
        </div>
    );
}