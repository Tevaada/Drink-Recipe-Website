import Link from "next/link";
import RecipeDetails from "@/components/RecipeDetails/RecipeDetails";
import styles from "./page.module.css";
import { notFound } from "next/navigation";
import { fetchDrinkById } from "@/lib/cocktailDb";

export const metadata = {
    title: "Recipe Details | Drink Recipe",
    description: "View ingredients and preparation instructions for this drink recipe.",
};

export default async function RecipePage({ params }) {
    const { id } = await params;

    if (!/^\d+$/.test(id)) {
        notFound();
    }

    const drink = await fetchDrinkById(id);

    if (!drink) {
        notFound();
    }

    return (
        <div className={styles.page}>
        <Link
            href="/recipes"
            className={styles.backLink}
        >
            <span aria-hidden="true">←</span>
            Back to recipes
        </Link>

        <RecipeDetails drink={drink} />
        </div>
    );
}