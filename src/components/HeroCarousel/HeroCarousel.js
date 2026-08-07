"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./HeroCarousel.module.css";

export default function HeroCarousel({recipes = []}){
    
    const slides = recipes.slice(0, 5);

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        if (isPaused || slides.length <= 1) {
            return;
        }

        const interval = setInterval(() => {
            setCurrentSlide((current) =>
            current === slides.length - 1 ? 0 : current + 1
            );
        }, 3000);
        return () => clearInterval(interval);
    }, [isPaused, slides.length]);

    const previousSlide = () => {
        setCurrentSlide((current) =>
        current === 0 ? slides.length - 1 : current - 1
        );
    };

    const nextSlide = () => {
        setCurrentSlide((current) =>
        current === slides.length - 1 ? 0 : current + 1
        );
    };

    if (slides.length === 0) {
        return null;
    }

    const slide = slides[currentSlide];

    return (
        <section className={styles.carousel} aria-roledescription="carousel" aria-label="Featured wellness drinks">
            <Image key={slide.id} className={styles.image} src={slide.image} alt="" fill priority={currentSlide === 0} sizes="(max-width: 1200px) 100vw, 1180px"/>
            
            <div className={styles.overlay}></div>
            
            <div key={`content-${slide.id}`} className={styles.content}>

                <span className={styles.eyebrow}>
                    {slide.category || "Featured drink"}
                </span>

                <h1 className={styles.title}> {slide.title} </h1>
                <p className={styles.description}>
                    {slide.description}
                </p>
                <Link href={`/recipes/${slide.id}`} className={styles.primaryButton}>
                    View recipe
                </Link>
            </div>

            <button type="button" className={`${styles.arrow} ${styles.previous}`} onClick={previousSlide} aria-label="Show previous slide">
                ←
            </button>

            <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={nextSlide} aria-label="Show next slide">
                →
            </button>

            <div className={styles.dots}>
                {slides.map((item, index) => (
                <button key={item.id} type="button" className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ""}`}onClick={() => setCurrentSlide(index)} aria-label = {`Show slide ${index + 1}`} aria-current = {index === currentSlide ? "true" : undefined}/>))}
            </div>
            
            <span className={styles.slideCounter}>
                {currentSlide + 1} / {slides.length}
            </span>

            <button type="button" className={styles.pauseButton} onClick={() => setIsPaused((paused) => !paused)} aria-label={isPaused ? "Resume carousel" : "Pause carousel"}>
                {isPaused ? "Play" : "Pause"}
            </button>

        </section>
    );
}
