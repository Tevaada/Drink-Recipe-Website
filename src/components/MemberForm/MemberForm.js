"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {loginAccount, signUpAccount,} from "@/app/member/actions";
import {migrateGuestFavorites,} from "@/services/memberFavorites";
import styles from "./MemberForm.module.css";

export default function MemberForm() {
    const router = useRouter();
    const [mode, setMode] = useState("signup");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    function changeMode(nextMode) {
        setMode(nextMode);
        setError("");
        setMessage("");
    }

    async function handleSubmit(event) {
        const form = event.currentTarget;
        event.preventDefault();

        setError("");
        setMessage("");

        const formData = new FormData(event.currentTarget);

        const values = {
            name: formData.get("name")?.trim(),
            email: formData.get("email")?.trim(),
            password: formData.get("password"),
            focusGoal: formData.get("focusGoal"),
        };

        if (mode === "signup" && !values.name) {
            setError("Please enter your name.");
            return;
        }

        if (!values.email) {
            setError("Please enter your email address.");
            return;
        }

        if (!values.password || values.password.length < 6) {
            setError(
                "Your password must contain at least 6 characters.",
            );
            return;
        }

        if (mode === "signup") {
            setIsLoading(true);

            try {
                const result =
                    await signUpAccount(values);

                if (result.error) {
                    setError(result.error);
                    return;
                }

                let successMessage = result.message;

                if (!result.needsEmailConfirmation) {
                    const migrationResult =
                        await migrateGuestFavorites();

                    if (migrationResult.migrated > 0) {
                        successMessage +=
                            ` ${migrationResult.migrated} guest favorite${
                                migrationResult.migrated === 1
                                    ? ""
                                    : "s"
                            } moved to your account.`;
                    }
                }

                setMessage(successMessage);
                form.reset();

                if (!result.needsEmailConfirmation) {
                    router.refresh();
                }
            } catch (signupError) {
                setError(
                    signupError.message ||
                    "Something went wrong. Please try again.",
                );
            } finally {
                setIsLoading(false);
            }

            return;
        }
        setIsLoading(true);

        try {
            const result = await loginAccount(values);

            if (result.error) {
                setError(result.error);
                return;
            }

            const migrationResult =
                await migrateGuestFavorites();

            const migrationMessage =
                migrationResult.migrated > 0
                    ? ` ${migrationResult.migrated} guest favorite${
                        migrationResult.migrated === 1
                            ? ""
                            : "s"
                    } moved to your account.`
                    : "";

            setMessage(
                `${result.message}${migrationMessage}`,
            );

            form.reset();
            router.refresh();
        } catch (loginError) {
            setError(
                loginError.message ||
                "Something went wrong. Please try again.",
            );

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <div className={styles.tabs} aria-label="Account form type">
                <button type="button" className={`${styles.tab} ${mode === "signup" ? styles.activeTab : ""}`} onClick={() => changeMode("signup")} aria-pressed={mode === "signup"} disabled={isLoading}>
                    Sign up
                </button>

                <button type="button" className={`${styles.tab} ${mode === "login" ? styles.activeTab : ""}`} onClick={() => changeMode("login")} aria-pressed={mode === "login"} disabled={isLoading}>
                    Log in
                </button>
            </div>

            <div className={styles.heading}>
                <span>Member access</span>

                <h2>{mode === "signup" ? "Create your profile" : "Welcome back"} </h2>
                <p> {mode === "signup" ? "Enter your details to begin your collection." : "Enter your account details to continue."} </p>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                {mode === "signup" && (
                <div className={styles.field}>
                    <label htmlFor="member-name">
                        Name
                    </label>

                    <input id="member-name" name="name" type="text" autoComplete="name" maxLength={80} required/>
                </div>
                )}

                <div className={styles.field}>
                    <label htmlFor="member-email">
                        Email
                    </label>

                    <input id="member-email" name="email" type="email" autoComplete="email" required/>
                </div>

                <div className={styles.field}>
                    <label htmlFor="member-password">
                        Password
                    </label>

                    <input id="member-password" name="password" type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={6} required/>
                    <small>
                        Use at least 6 characters.
                    </small>
                </div>

                {mode === "signup" && (
                <div className={styles.field}>
                    <label htmlFor="focus-goal">
                        Main interest
                    </label>

                    <select id="focus-goal" name="focusGoal" defaultValue="Explore drinks">
                        <option value="Explore drinks">
                            Explore drinks
                        </option>

                        <option value="Focus">
                            Focus
                        </option>

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
                )}

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
                    className={styles.submitButton}
                    disabled={isLoading}
                >
                    {isLoading
                        ? "Please wait..."
                        : mode === "signup"
                        ? "Create profile"
                        : "Log in"}
                </button>
            </form>

            <button type="button" className={styles.switchButton} onClick={() => changeMode(mode === "signup" ? "login" : "signup",)} disabled={isLoading}>
                {mode === "signup"
                ? "Already have an account? Log in"
                : "Need an account? Sign up"}
            </button>
        </div>
    );
}
