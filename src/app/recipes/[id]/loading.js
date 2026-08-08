import styles from "./loading.module.css";

export default function RecipeLoading() {
    return (
        <div
            className={styles.loading}
            aria-busy="true"
            aria-label="Loading recipe"
        >
            <div className={styles.imageSkeleton} />

            <div className={styles.content}>
                <div className={styles.shortLine} />
                <div className={styles.titleLine} />
                <div className={styles.textLine} />
                <div className={styles.textLine} />

                <span className={styles.message}>
                    Loading recipe details...
                </span>
            </div>
        </div>
    );
}
