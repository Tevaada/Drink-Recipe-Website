"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteAccount } from "@/app/member/actions";
import styles from "./DeleteAccountButton.module.css";

export default function DeleteAccountButton() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleDelete() {
        const confirmed = window.confirm(
            "Permanently delete your account and favorites? This cannot be undone.",
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            setIsLoading(true);

            const result = await deleteAccount();

            if (result.error) {
                setError(result.error);
                return;
            }

            router.push("/");
            router.refresh();
        } catch {
            setError(
                "Your account could not be deleted. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.wrapper}>
            <button
                type="button"
                className={styles.button}
                onClick={handleDelete}
                disabled={isLoading}
            >
                {isLoading
                    ? "Deleting account..."
                    : "Delete account"}
            </button>

            {error && (
                <p className={styles.error} role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}