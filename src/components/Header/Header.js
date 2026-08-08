"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import styles from "./Header.module.css";

const navigation = [
    { href: "/", label: "Home" },
    { href: "/recipes", label: "Formulations" },
    { href: "/favorites", label: "The Vault" },
    { href: "/about", label: "The Vision" },
];

export default function Header({ initialUser = null }) {
    const pathname = usePathname();
    const router = useRouter();

    function isActive(path) {
        return path === "/"
            ? pathname === "/"
            : pathname.startsWith(path);
    }

    const currentSection = navigation.find(
        ({ href }) => href !== "/" && pathname.startsWith(href),
    )?.href || "/";

    return (
        <header className={styles.siteHeader}>
            <div className={styles.headerContent}>
                <Link href="/" className={styles.brand}>
                    <span className={styles.brandMark}>LM</span>
                    <span className={styles.brandText}>
                        <strong>Recipe</strong>
                        <small>Drink Recipe</small>
                    </span>
                </Link>

                <nav
                    className={styles.desktopNav}
                    aria-label="Main navigation"
                >
                    {navigation.map(({ href, label }) => {
                        const active = isActive(href);

                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`${styles.navLink} ${
                                    active ? styles.active : ""
                                }`}
                                aria-current={active ? "page" : undefined}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.headerActions}>
                    <label className={styles.mobileNavLabel}>
                        <span className={styles.visuallyHidden}>
                            Choose a page
                        </span>
                        <select
                            className={styles.mobileNav}
                            value={currentSection}
                            onChange={(event) =>
                                router.push(event.target.value)
                            }
                        >
                            {navigation.map(({ href, label }) => (
                                <option key={href} value={href}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <Link
                        href={initialUser ? "/account" : "/member"}
                        className={styles.memberButton}
                        title={initialUser?.displayName}
                    >
                        {initialUser?.displayName || "Join member"}
                    </Link>
                </div>
            </div>
        </header>
    );
}
