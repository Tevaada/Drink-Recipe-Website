import FavoritesContent from "@/components/FavoritesContent/FavoritesContent";
import styles from "./page.module.css";

export const metadata = {
    title: "Favorites | Drink Recipe",
    description:
    "View the drink recipes you saved as favorites.",
};

export default function FavoritesPage() {
    return (
        <div className={styles.page}>
            <header className={styles.pageHeader}>
                
                <span className={styles.eyebrow}>
                    Your collection
                </span>

                <h1 className={styles.title}>
                    Favorite recipes
                </h1>

                <p className={styles.description}>
                    Return to the drink recipes you saved for later.
                </p>
            </header>

            <FavoritesContent />
        </div>
    );
}