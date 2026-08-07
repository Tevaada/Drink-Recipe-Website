"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/app/member/actions";
import styles from "./ProfileEditor.module.css";

export default function ProfileEditor({ profile }) {
    const router = useRouter();

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setMessage("");
        setIsLoading(true);

        const formData = new FormData(event.currentTarget);

        const values = {
            displayName:
                formData.get("displayName")?.trim(),
            wellnessGoal:
                formData.get("wellnessGoal"),
        };

        try {
            const result = await updateProfile(values);

            if (result.error) {
                setError(result.error);
                return;
            }

            setMessage(result.message);
            router.refresh();
        } catch {
            setError(
                "Something went wrong. Please try again.",
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form
            className={styles.editor}
            onSubmit={handleSubmit}
        >
            <h3 className={styles.title}>
                Edit profile
            </h3>

            <div className={styles.field}>
                <label htmlFor="profile-display-name">
                    Display name
                </label>

                <input
                    id="profile-display-name"
                    name="displayName"
                    type="text"
                    defaultValue={
                        profile?.display_name || ""
                    }
                    maxLength={80}
                    required
                />
            </div>

            <div className={styles.field}>
                <label htmlFor="profile-wellness-goal">
                    Main interest
                </label>

                <select
                    id="profile-wellness-goal"
                    name="wellnessGoal"
                    defaultValue={
                        profile?.wellness_goal ||
                        "Explore drinks"
                    }
                >
                    <option value="Explore drinks">
                        Explore drinks
                    </option>
                    <option value="Focus">Focus</option>
                    <option value="Recovery">
                        Recovery
                    </option>
                    <option value="Hydration">
                        Hydration
                    </option>
                    <option value="Alcohol-free">
                        Alcohol-free
                    </option>
                </select>
            </div>

            {error && (
                <p className={styles.error} role="alert">
                    {error}
                </p>
            )}

            {message && (
                <p className={styles.success} role="status">
                    {message}
                </p>
            )}

            <button
                type="submit"
                className={styles.saveButton}
                disabled={isLoading}
            >
                {isLoading
                    ? "Saving..."
                    : "Save profile"}
            </button>
        </form>
    );
}