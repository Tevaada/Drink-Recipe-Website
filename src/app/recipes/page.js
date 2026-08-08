import RecipeExplorer from "@/components/RecipeExplorer/RecipeExplorer";
import styles from "./page.module.css";

export const metadata = {
    title: "Formulations | Drink Recipe",
    description: "Browse natural drink recipes for focus, recovery, hydration, and energy.",
};
export default async function RecipesPage({ searchParams }) {
    const parameters = await searchParams;

    const initialCategory =parameters.category || "all";

    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                <span className={styles.eyebrow}>
                Recipe collection
                </span>

                <h1 className={styles.title}>
                Formulations
                </h1>

                <p className={styles.description}>
                Explore a curated collection of cocktails,
                alcohol-free drinks, coffee recipes, and more.
                </p>
            </header>

        <RecipeExplorer initialCategory={initialCategory}/>
        </div>
    );
}
