import Link from "next/link";
import styles from "./page.module.css";

const principles = [
    {
        number: "01",
        title: "Simple ingredients",
        description:
        "Every drink begins with ingredients that are easy to understand and find.",
    },
    {
        number: "02",
        title: "Intentional function",
        description:
        "Recipes are organized around focus, recovery, refreshment, and everyday enjoyment.",
    },
    {
        number: "03",
        title: "Accessible preparation",
        description:
        "Clear measurements and instructions make each recipe practical to prepare.",
    },
    ];

    export const metadata = {
    title: "The Vision | Drink Recipe",
    description:
        "Learn about our approach to accessible drink recipes and everyday wellness.",
    };

    export default function AboutPage() {
    return (
        <div className={styles.page}>
        <section className={styles.introduction}>
            <div className={styles.visual}>
            <div className={styles.visualMark}>
                LM
            </div>

            <p>Drink with intention</p>
            </div>

            <div className={styles.content}>
            <span className={styles.eyebrow}>
                The vision
            </span>

            <h1>
                Better drinks begin with better information
            </h1>

            <p>
                This project brings recipes, ingredients, and
                preparation guidance into one approachable
                collection. It helps people discover drinks for
                different tastes, occasions, and routines.
            </p>

            <p>
                Our goal is not to make wellness complicated.
                We focus on clear recipes, useful details, and
                an experience that makes exploration enjoyable.
            </p>

            <Link
                href="/recipes"
                className={styles.primaryButton}
            >
                Explore formulations
            </Link>
            </div>
        </section>

        <section
            className={styles.principlesSection}
            aria-labelledby="principles-title"
        >
            <div className={styles.sectionHeading}>
            <span className={styles.eyebrow}>
                Our approach
            </span>

            <h2 id="principles-title">
                Principles behind every recipe
            </h2>
            </div>

            <div className={styles.principles}>
            {principles.map((principle) => (
                <article
                key={principle.number}
                className={styles.principle}
                >
                <strong>{principle.number}</strong>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
                </article>
            ))}
            </div>
        </section>
        </div>
    );
}