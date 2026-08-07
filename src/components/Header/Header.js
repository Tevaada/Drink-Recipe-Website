"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Header.module.css";

    export default function Header() {
        const pathname = usePathname();
        const router = useRouter();

        function isActive(path) {
            if (path === "/"){
                return pathname === "/";
            }
            return pathname.startsWith(path);
        }
        const currentSection = pathname.startsWith("/recipes")
        ? "/recipes"
        : pathname.startsWith("/favorites")
            ? "/favorites"
            : pathname.startsWith("/about")
                ? "/about"
                : "/";
                
    return (
        <header className={styles.siteHeader}>
        <div className={styles.headerContent}>
            {/* Brand */}
            <Link href="/" className={styles.brand}>
            <span className={styles.brandMark}>LM</span>

            <span className={styles.brandText}>
                <strong>Recipe</strong>
                <small>Drink Recipe</small>
            </span>
            </Link>

            {/* Desktop navigation */}
            <nav className={styles.desktopNav} aria-label="Main navigation">
                <Link
                    href="/"
                    className={`${styles.navLink} ${
                    isActive("/") ? styles.active : ""
                    }`}
                    aria-current={isActive("/") ? "page" : undefined}
                >
                    Home
                </Link>

                <Link
                    href="/recipes"
                    className={`${styles.navLink} ${
                    isActive("/recipes") ? styles.active : ""
                    }`}
                    aria-current={isActive("/recipes") ? "page" : undefined}
                >
                    Formulations
                </Link>

                <Link
                    href="/favorites"
                    className={`${styles.navLink} ${
                    isActive("/favorites") ? styles.active : ""
                    }`}
                    aria-current={isActive("/favorites") ? "page" : undefined}
                >
                    The Vault
                </Link>

                <Link
                    href="/about"
                    className={`${styles.navLink} ${
                    isActive("/about") ? styles.active : ""
                    }`}
                    aria-current={isActive("/about") ? "page" : undefined}
                >
                    The Vision
                </Link>
            </nav>

            {/* Member section */}
            <div className={styles.headerActions}>
            <label className={styles.mobileNavLabel}>
                <span className={styles.visuallyHidden}>
                Choose a page
                </span>

                <select
                className={styles.mobileNav}
                value={currentSection}
                onChange={(event) => router.push(event.target.value)}
                >
                <option value="/">Home</option>
                <option value="/recipes">Formulations</option>
                <option value="/favorites">The Vault</option>
                <option value="/about">The Vision</option>
                </select>
            </label>

            <Link href="/member" className={styles.memberButton}>
                Join member
            </Link>
            </div>
        </div>
        </header>
    );
    }
